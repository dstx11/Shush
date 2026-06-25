#!/usr/bin/env python3
"""
Static validation helper for the SHUSH website.

Run from project root:
    python scripts/validate_shush_static.py

Use final enforcement after the redesign:
    python scripts/validate_shush_static.py --final

This is not a browser test. It catches common static regressions before manual QA.
"""
from __future__ import annotations

import argparse
import re
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]

FINAL_PAGES = ["index.html", "roster.html", "drop01.html", "about.html"]
LEGACY_FALLBACK_PAGE = "callroom.html"
FINAL_FORBIDDEN_VISIBLE_TERMS = [
    "Call Room",
    "Troll Mode",
    "mental damage",
    "comms unstable",
]

ASSET_PATTERNS = [
    re.compile(r'''(?:src|href)=["']([^"']+)["']''', re.I),
    re.compile(r'''url\(["']?([^"')]+)["']?\)''', re.I),
]
HTML_LINK_PATTERN = re.compile(r'''href=["']([^"']+\.html(?:#[^"']*)?)["']''', re.I)
AVATAR_PATH_PATTERN = re.compile(r'''["'](assets/avatars/[^"']+\.(?:png|jpe?g|webp))["']''', re.I)


def read(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return path.read_text(encoding="latin-1")


def is_external(ref: str) -> bool:
    ref = ref.strip()
    if "${" in ref or ref.startswith("%"):
        return True
    if ref.startswith(("http://", "https://", "mailto:", "tel:", "#", "data:")):
        return True
    parsed = urlparse(ref)
    return bool(parsed.scheme and parsed.netloc)


def clean_ref(ref: str) -> str:
    return ref.split("#", 1)[0].split("?", 1)[0].strip()


def site_files(include_docs: bool = False) -> list[Path]:
    exts = {".html", ".css", ".js", ".txt", ".md"}
    support_files = {"AGENTS.md", "CODEX_MASTER_PROMPT.md", "START_HERE_CODEX.md"}
    files: list[Path] = []
    for path in ROOT.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in exts:
            continue
        if path.name in support_files:
            continue
        if not include_docs and ("docs" in path.parts or "scripts" in path.parts):
            continue
        files.append(path)
    return files


def local_target(path: Path, ref: str) -> Path:
    base = path.parent if path.suffix.lower() == ".css" else ROOT
    return (base / ref).resolve()


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate SHUSH static site references and final-readiness markers.")
    parser.add_argument("--final", action="store_true", help="enforce final redesign requirements")
    args = parser.parse_args()

    errors: list[str] = []
    warnings: list[str] = []

    required_pages = FINAL_PAGES
    for page in required_pages:
        if not (ROOT / page).exists():
            target = errors if args.final else warnings
            target.append(f"Missing expected page: {page}")

    if (ROOT / LEGACY_FALLBACK_PAGE).exists():
        warnings.append("Legacy callroom.html still exists. This is OK only if it is an intentional redirect/fallback.")

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
                target = local_target(path, ref_clean)
                try:
                    target.relative_to(ROOT.resolve())
                except ValueError:
                    warnings.append(f"Reference escapes project root in {path.relative_to(ROOT)}: {ref}")
                    continue
                if not target.exists():
                    severity = warnings if "assets/avatars/" in ref_clean.replace("\\", "/") and not args.final else errors
                    severity.append(f"Missing asset referenced in {path.relative_to(ROOT)}: {ref}")

    for path in files_to_scan:
        if path.suffix.lower() not in {".html", ".js"}:
            continue
        text = read(path)
        for match in AVATAR_PATH_PATTERN.finditer(text):
            ref = match.group(1).replace("\\", "/")
            if not (ROOT / ref).exists():
                target = errors if args.final else warnings
                target.append(f"Avatar path currently has no file: {path.relative_to(ROOT)} -> {ref}")

    for page in [p for p in ROOT.glob("*.html") if p.name != LEGACY_FALLBACK_PAGE]:
        text = read(page)
        lower = text.lower()
        if "<html" in lower and 'lang="pt-pt"' not in lower and "lang='pt-pt'" not in lower:
            warnings.append(f"No lang=\"pt-PT\" found in {page.name}")
        if "<nav" not in lower:
            warnings.append(f"No <nav> found in {page.name}")
        if "<nav" in lower and "aria-label" not in lower:
            warnings.append(f"No nav aria-label found in {page.name}")
        if 'aria-current="page"' not in text and "aria-current='page'" not in text:
            warnings.append(f"No active aria-current page marker found in {page.name}")
        if "menu-toggle" in text and "aria-controls" not in text:
            target = errors if args.final else warnings
            target.append(f"Mobile menu button has no aria-controls in {page.name}")

    drop = ROOT / "drop01.html"
    if drop.exists():
        drop_text = read(drop)
        if 'id="orderOutput"' in drop_text and "aria-live" not in drop_text:
            target = errors if args.final else warnings
            target.append("Drop 01 output exists without aria-live.")

    avatars = ROOT / "assets" / "avatars"
    if not avatars.exists():
        errors.append("Missing assets/avatars folder.")
    else:
        avatar_images = [p for p in avatars.iterdir() if p.is_file() and p.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp"}]
        if not avatar_images:
            warnings.append("assets/avatars has no image files. This is intentional if roster uses placeholders and no broken image references.")

    if args.final:
        for path in site_files(include_docs=False):
            if path.name == LEGACY_FALLBACK_PAGE:
                continue
            text = read(path)
            for term in FINAL_FORBIDDEN_VISIBLE_TERMS:
                if term.lower() in text.lower():
                    errors.append(f"Forbidden final term '{term}' found in {path.relative_to(ROOT)}")

        about = ROOT / "about.html"
        if about.exists():
            text = read(about).lower()
            if "backora" not in text:
                errors.append("about.html should mention Backora credibly.")

    print("SHUSH static validation")
    print("=" * 24)
    print(f"Mode: {'final' if args.final else 'current/prep'}")

    if errors:
        print("\nERRORS:")
        for item in errors:
            print(f"- {item}")
    if warnings:
        print("\nWARNINGS:")
        for item in warnings:
            print(f"- {item}")
    if not errors and not warnings:
        print("No obvious static issues found.")

    print("\nSummary:")
    print(f"- Errors: {len(errors)}")
    print(f"- Warnings: {len(warnings)}")

    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
