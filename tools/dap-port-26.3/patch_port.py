#!/usr/bin/env python3
from pathlib import Path
import re
import sys

root = Path(sys.argv[1]).resolve()

# Keep the build aligned with the user's Shush Cozy 26.3 pack.
props = root / "gradle.properties"
text = props.read_text(encoding="utf-8")
text = re.sub(r"(?m)^loom_version=.*$", "loom_version=1.18.2", text)
text = re.sub(r"(?m)^fabric_api_version=.*$", "fabric_api_version=0.161.0+26.3", text)
text = re.sub(r"(?m)^loader_version=.*$", "loader_version=0.19.5", text)
text = re.sub(r"(?m)^minecraft_version=.*$", "minecraft_version=26.3", text)
text = re.sub(r"(?m)^pal_version\s*=.*$", "pal_version=1.2.8+mc.26.3", text)
props.write_text(text, encoding="utf-8")

# Minecraft 26.3 uses SDL internally. Never feed legacy GLFW integer codes
# into InputConstants: use the named 26.3 constants instead.
key_replacements = {
    "com.mojang.blaze3d.platform.InputConstants.isKeyDown(71)": "com.mojang.blaze3d.platform.InputConstants.isKeyDown(com.mojang.blaze3d.platform.InputConstants.KEY_G)",
    "com.mojang.blaze3d.platform.InputConstants.isKeyDown(72)": "com.mojang.blaze3d.platform.InputConstants.isKeyDown(com.mojang.blaze3d.platform.InputConstants.KEY_H)",
    "com.mojang.blaze3d.platform.InputConstants.isKeyDown(70)": "com.mojang.blaze3d.platform.InputConstants.isKeyDown(com.mojang.blaze3d.platform.InputConstants.KEY_F)",
    "com.mojang.blaze3d.platform.InputConstants.isKeyDown(82)": "com.mojang.blaze3d.platform.InputConstants.isKeyDown(com.mojang.blaze3d.platform.InputConstants.KEY_R)",
    "com.mojang.blaze3d.platform.InputConstants.isKeyDown(87)": "com.mojang.blaze3d.platform.InputConstants.isKeyDown(com.mojang.blaze3d.platform.InputConstants.KEY_W)",
    "com.mojang.blaze3d.platform.InputConstants.isKeyDown(65)": "com.mojang.blaze3d.platform.InputConstants.isKeyDown(com.mojang.blaze3d.platform.InputConstants.KEY_A)",
    "com.mojang.blaze3d.platform.InputConstants.isKeyDown(83)": "com.mojang.blaze3d.platform.InputConstants.isKeyDown(com.mojang.blaze3d.platform.InputConstants.KEY_S)",
    "com.mojang.blaze3d.platform.InputConstants.isKeyDown(68)": "com.mojang.blaze3d.platform.InputConstants.isKeyDown(com.mojang.blaze3d.platform.InputConstants.KEY_D)",
    "com.mojang.blaze3d.platform.InputConstants.isKeyDown(32)": "com.mojang.blaze3d.platform.InputConstants.isKeyDown(com.mojang.blaze3d.platform.InputConstants.KEY_SPACE)",
    "com.mojang.blaze3d.platform.InputConstants.isKeyDown(340)": "com.mojang.blaze3d.platform.InputConstants.isKeyDown(com.mojang.blaze3d.platform.InputConstants.KEY_LSHIFT)",
    "com.mojang.blaze3d.platform.InputConstants.isKeyDown(344)": "com.mojang.blaze3d.platform.InputConstants.isKeyDown(com.mojang.blaze3d.platform.InputConstants.KEY_RSHIFT)",
}

mapping_replacements = {
    "com.mojang.blaze3d.platform.InputConstants.Type.KEYBOARD, 71,": "com.mojang.blaze3d.platform.InputConstants.Type.KEYBOARD, com.mojang.blaze3d.platform.InputConstants.KEY_G,",
    "com.mojang.blaze3d.platform.InputConstants.Type.KEYBOARD, 72,": "com.mojang.blaze3d.platform.InputConstants.Type.KEYBOARD, com.mojang.blaze3d.platform.InputConstants.KEY_H,",
    "com.mojang.blaze3d.platform.InputConstants.Type.KEYBOARD, 70,": "com.mojang.blaze3d.platform.InputConstants.Type.KEYBOARD, com.mojang.blaze3d.platform.InputConstants.KEY_F,",
    "com.mojang.blaze3d.platform.InputConstants.Type.KEYBOARD, 82,": "com.mojang.blaze3d.platform.InputConstants.Type.KEYBOARD, com.mojang.blaze3d.platform.InputConstants.KEY_R,",
    "com.mojang.blaze3d.platform.InputConstants.Type.KEYBOARD, 84,": "com.mojang.blaze3d.platform.InputConstants.Type.KEYBOARD, com.mojang.blaze3d.platform.InputConstants.KEY_T,",
    "com.mojang.blaze3d.platform.InputConstants.Type.KEYBOARD, 86,": "com.mojang.blaze3d.platform.InputConstants.Type.KEYBOARD, com.mojang.blaze3d.platform.InputConstants.KEY_V,",
    "com.mojang.blaze3d.platform.InputConstants.Type.KEYBOARD, 74,": "com.mojang.blaze3d.platform.InputConstants.Type.KEYBOARD, com.mojang.blaze3d.platform.InputConstants.KEY_J,",
    "com.mojang.blaze3d.platform.InputConstants.Type.KEYBOARD, 76,": "com.mojang.blaze3d.platform.InputConstants.Type.KEYBOARD, com.mojang.blaze3d.platform.InputConstants.KEY_L,",
    "com.mojang.blaze3d.platform.InputConstants.Type.KEYBOARD, 77,": "com.mojang.blaze3d.platform.InputConstants.Type.KEYBOARD, com.mojang.blaze3d.platform.InputConstants.KEY_M,",
}

changed = []
for path in root.rglob("*.java"):
    src = path.read_text(encoding="utf-8")
    dst = src
    for old, new in key_replacements.items():
        dst = dst.replace(old, new)
    for old, new in mapping_replacements.items():
        dst = dst.replace(old, new)
    if dst != src:
        path.write_text(dst, encoding="utf-8")
        changed.append(str(path.relative_to(root)))

# BrosClientHandler was interpreting raw legacy numeric codes and trying to
# guess whether a KeyMapping represented a mouse button. Let vanilla/Fabric
# track the rebind state instead; this is loader/input-backend agnostic.
bros = root / "src/main/java/com/cooptest/bros/client/BrosClientHandler.java"
if bros.exists():
    src = bros.read_text(encoding="utf-8")
    old = """   private static boolean isDown(KeyMapping kb) {
      if (kb == null) {
         return false;
      }

      Minecraft mc = Minecraft.getInstance();
      int code = KeyMappingHelper.getBoundKeyOf(kb).getValue();
      if (code < 0) {
         return false;
      }

      long win = mc.getWindow().handle();
      return code <= 7 ? (code == 0 ? net.minecraft.client.Minecraft.getInstance().options.keyAttack.isDown() : code == 1 && net.minecraft.client.Minecraft.getInstance().options.keyUse.isDown()) : com.mojang.blaze3d.platform.InputConstants.isKeyDown(code);
   }
"""
    new = """   private static boolean isDown(KeyMapping kb) {
      return kb != null && kb.isDown();
   }
"""
    if old in src:
        bros.write_text(src.replace(old, new), encoding="utf-8")
        changed.append(str(bros.relative_to(root)) + " (KeyMapping state fix)")

# Source is compiled for Java 25; keep Mixin compatibility metadata aligned.
mixins = root / "src/main/resources/testcoop.mixins.json"
if mixins.exists():
    src = mixins.read_text(encoding="utf-8")
    dst = src.replace('"compatibilityLevel": "JAVA_21"', '"compatibilityLevel": "JAVA_25"')
    if dst != src:
        mixins.write_text(dst, encoding="utf-8")
        changed.append(str(mixins.relative_to(root)))

print("Patched files:")
for p in sorted(set(changed)):
    print(" -", p)
