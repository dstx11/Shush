#!/usr/bin/env python3
"""
Static validation helper for the SHUSH website.
Run from project root:
    python scripts/validate_shush_static.py

This is not a browser test. It catches common regressions before manual QA.
"""
from __future__ import annotations

import re
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
SITE_EXTS = {".html", ".css", ".js", ".txt"}
SITE_FILES = [
    p for p in ROOT.rglob("*")
    if p.is_file()
    and p.suffix.lower() in SITE_EXTS
    and "docs" not in p.parts
    and "scripts" not in p.parts
    and p.name not in {"AGENTS.md", "CODEX_MASTER_PROMPT.md", "START_HERE_CODEX.md"}
]

REQUIRED_PAGES = ["index.html", "roster.html", "drop01.html", "about.html"]
FORBIDDEN_VISIBLE_TERMS = ["Call Room", "Troll Mode", "mental damage", "comms unstable"]
REDIRECT_ALLOWED = {"callroom.html"}

ASSET_PATTERNS = [
    re.compile(r'''(?:src|href)=["']([^"']+)["']''', re.I),
    re.compile(r'''url\(["']?([^"')]+)["']?\)''', re.I),
]
HTML_LINK_PATTERN = re.compile(r'''href=["']([^"']+\.html(?:#[^"']*)?)["']''', re.I)


def read(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return path.read_text(encoding="latin-1")


def is_external(ref: str) -> bool:
    ref = ref.strip()
    if ref.startswith(("http://", "https://", "mailto:", "tel:", "#", "data:")):
        return True
    parsed = urlparse(ref)
    return bool(parsed.scheme and parsed.netloc)


def clean_ref(ref: str) -> str:
    return ref.split("#", 1)[0].split("?", 1)[0].strip()


def main() -> int:
    errors: list[str] = []
    warnings: list[str] = []

    for page in REQUIRED_PAGES:
        if not (ROOT / page).exists():
            errors.append(f"Missing required page: {page}")

    for path in SITE_FILES:
        rel = path.relative_to(ROOT).as_posix()
        text = read(path)
        for term in FORBIDDEN_VISIBLE_TERMS:
            if term.lower() in text.lower():
                if path.name in REDIRECT_ALLOWED and term == "Call Room":
                    warnings.append(f"Legacy term '{term}' remains in {rel}; allowed only if this file is a redirect/fallback.")
                else:
                    errors.append(f"Forbidden term '{term}' found in {rel}")

    for path in ROOT.glob("*.html"):
        text = read(path)
        for match in HTML_LINK_PATTERN.finditer(text):
            ref = clean_ref(match.group(1))
            if ref and not (ROOT / ref).exists():
                errors.append(f"Broken HTML link in {path.name}: {match.group(1)}")

    files_to_scan = [
        p for p in ROOT.rglob("*")
        if p.is_file()
        and p.suffix.lower() in {".html", ".css", ".js"}
        and "docs" not in p.parts
        and "scripts" not in p.parts
    ]
    for path in files_to_scan:
        text = read(path)
        for pattern in ASSET_PATTERNS:
            for match in pattern.finditer(text):
                ref = match.group(1).strip()
                if not ref or is_external(ref):
                    continue
                ref_clean = clean_ref(ref)
                if not ref_clean or ref_clean.endswith(".html"):
                    continue
                base = path.parent if path.suffix.lower() == ".css" else ROOT
                target = (base / ref_clean).resolve()
                try:
                    target.relative_to(ROOT.resolve())
                except ValueError:
                    warnings.append(f"Reference escapes project root in {path.relative_to(ROOT)}: {ref}")
                    continue
                if not target.exists():
                    errors.append(f"Missing asset referenced in {path.relative_to(ROOT)}: {ref}")

    for page in [p for p in ROOT.glob("*.html") if p.name != "callroom.html"]:
        text = read(page)
        if "<nav" not in text.lower():
            warnings.append(f"No <nav> found in {page.name}")
        if 'aria-current="page"' not in text and "aria-current='page'" not in text:
            warnings.append(f"No active aria-current page marker found in {page.name}")

    avatars = ROOT / "assets" / "avatars"
    if avatars.exists() and not any(p.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp"} for p in avatars.iterdir() if p.is_file()):
        warnings.append("assets/avatars has no image files. This is OK only if roster uses initials/placeholders and no broken image references.")

    print("SHUSH static validation")
    print("=" * 24)
    if errors:
        print("\nERRORS:")
        for e in errors:
            print(f"- {e}")
    if warnings:
        print("\nWARNINGS:")
        for w in warnings:
            print(f"- {w}")
    if not errors and not warnings:
        print("No obvious static issues found.")
    print("\nSummary:")
    print(f"- Errors: {len(errors)}")
    print(f"- Warnings: {len(warnings)}")
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
