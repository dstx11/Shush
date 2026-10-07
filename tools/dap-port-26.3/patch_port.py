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


# Restore trajectory dots with the 26.3 deferred submit API.
trajectory = root / "src/main/java/com/cooptest/client/TrajectoryRenderer.java"
if trajectory.exists():
    trajectory.write_text(r'''package com.cooptest.client;

import com.cooptest.GrabInputHandler;
import com.cooptest.PoseNetworking;
import com.cooptest.PoseState;
import com.mojang.blaze3d.vertex.PoseStack;
import net.fabricmc.fabric.api.client.rendering.v1.level.LevelRenderContext;
import net.fabricmc.fabric.api.client.rendering.v1.level.LevelRenderEvents;
import net.minecraft.client.Minecraft;
import net.minecraft.client.renderer.RenderPipelines;
import net.minecraft.client.renderer.rendertype.RenderSetup;
import net.minecraft.client.renderer.rendertype.RenderType;
import net.minecraft.world.phys.Vec3;

public class TrajectoryRenderer {
    private static final int TRAJECTORY_POINTS = 30;
    private static final float GRAVITY = 0.08f;
    private static final float DRAG = 0.02f;
    private static final float DOT_SIZE = 0.08f;
    private static final float MIN_POWER_MULT = 1.5f;
    private static final float MAX_POWER_MULT = 3.5f;

    private static final RenderType TRAJECTORY_TYPE = RenderType.create(
            "trajectory",
            RenderSetup.builder(RenderPipelines.DEBUG_FILLED_BOX).createRenderSetup()
    );

    public static void register() {
        LevelRenderEvents.END_MAIN.register(TrajectoryRenderer::render);
    }

    private static void render(LevelRenderContext context) {
        Minecraft client = Minecraft.getInstance();
        if (client.player == null || client.level == null) return;

        PoseState pose = PoseNetworking.poseStates.getOrDefault(client.player.getUUID(), PoseState.NONE);
        if (pose != PoseState.GRAB_HOLDING) return;

        float chargeProgress = GrabInputHandler.getThrowChargeProgress();
        if (chargeProgress <= 0.0f) return;

        float power = MIN_POWER_MULT + (MAX_POWER_MULT - MIN_POWER_MULT) * chargeProgress;
        Vec3 lookVec = client.player.getViewVector(client.getDeltaTracker().getGameTimeDeltaTicks());
        Vec3 pos = client.player.getEyePosition().add(0.0, 0.5, 0.0);
        Vec3 vel = lookVec.scale(power);

        Vec3[] points = new Vec3[TRAJECTORY_POINTS];
        for (int i = 0; i < TRAJECTORY_POINTS; i++) {
            points[i] = pos;
            vel = vel.add(0.0, -GRAVITY, 0.0).scale(1.0 - DRAG);
            pos = pos.add(vel);
            if (pos.y < client.player.getY() - 10.0) break;
        }

        renderTrajectoryDots(context, points, chargeProgress);
    }

    private static void renderTrajectoryDots(LevelRenderContext context, Vec3[] points, float charge) {
        Vec3 camPos = context.levelState().cameraRenderState.pos;
        PoseStack matrices = context.poseStack();

        matrices.pushPose();
        matrices.translate(-camPos.x, -camPos.y, -camPos.z);

        int r = (int)(charge * 255.0f);
        int g = (int)((1.0f - charge) * 255.0f);
        int b = 50;

        context.submitNodeCollector().order(0).submitCustomGeometry(
                matrices,
                TRAJECTORY_TYPE,
                (pose, consumer) -> {
                    for (int i = 0; i < points.length && points[i] != null; i++) {
                        Vec3 point = points[i];
                        int alpha = (int)(200.0f * (1.0f - (float)i / points.length));
                        float size = DOT_SIZE * (1.0f - (float)i / points.length * 0.5f);
                        float x = (float)point.x;
                        float y = (float)point.y;
                        float z = (float)point.z;

                        consumer.addVertex(pose, x-size, y-size, z+size).setColor(r, g, b, alpha);
                        consumer.addVertex(pose, x+size, y-size, z+size).setColor(r, g, b, alpha);
                        consumer.addVertex(pose, x+size, y+size, z+size).setColor(r, g, b, alpha);
                        consumer.addVertex(pose, x-size, y+size, z+size).setColor(r, g, b, alpha);

                        consumer.addVertex(pose, x+size, y-size, z-size).setColor(r, g, b, alpha);
                        consumer.addVertex(pose, x-size, y-size, z-size).setColor(r, g, b, alpha);
                        consumer.addVertex(pose, x-size, y+size, z-size).setColor(r, g, b, alpha);
                        consumer.addVertex(pose, x+size, y+size, z-size).setColor(r, g, b, alpha);

                        consumer.addVertex(pose, x-size, y+size, z-size).setColor(r, g, b, alpha);
                        consumer.addVertex(pose, x-size, y+size, z+size).setColor(r, g, b, alpha);
                        consumer.addVertex(pose, x+size, y+size, z+size).setColor(r, g, b, alpha);
                        consumer.addVertex(pose, x+size, y+size, z-size).setColor(r, g, b, alpha);
                    }
                }
        );

        matrices.popPose();
    }
}
''', encoding="utf-8")
    changed.append(str(trajectory.relative_to(root)) + " (restored 26.3 trajectory renderer)")

# Restore the expanding shockwave with the same deferred custom-geometry path.
shockwave = root / "src/main/java/com/cooptest/client/CoopShockwaveRenderer.java"
if shockwave.exists():
    shockwave.write_text(r'''package com.cooptest.client;

import com.mojang.blaze3d.vertex.PoseStack;
import net.fabricmc.fabric.api.client.rendering.v1.level.LevelRenderContext;
import net.minecraft.client.renderer.rendertype.RenderTypes;
import net.minecraft.world.phys.Vec3;

public class CoopShockwaveRenderer {
    private static final long DURATION_MS = 450L;
    private static final float MAX_RADIUS = 2.5F;
    private static final int RINGS = 3;
    private static final int SEGMENTS = 48;
    private static Vec3 center = null;
    private static long startMs = 0L;

    public static void start(Vec3 position) {
        center = position;
        startMs = System.currentTimeMillis();
    }

    public static void render(LevelRenderContext context) {
        if (center == null) return;

        long elapsed = System.currentTimeMillis() - startMs;
        if (elapsed > DURATION_MS) {
            center = null;
            return;
        }

        float progress = (float)elapsed / (float)DURATION_MS;
        float alpha = (1.0F - progress) * (1.0F - progress);
        Vec3 camPos = context.levelState().cameraRenderState.pos;
        PoseStack matrices = context.poseStack();

        matrices.pushPose();
        matrices.translate(center.x - camPos.x, center.y - camPos.y, center.z - camPos.z);

        context.submitNodeCollector().order(0).submitCustomGeometry(
                matrices,
                RenderTypes.lines(),
                (pose, buf) -> {
                    for (int ring = 0; ring < RINGS; ring++) {
                        float ringProgress = (progress + ring * 0.15F) % 1.0F;
                        float radius = ringProgress * MAX_RADIUS;
                        float ringAlpha = alpha * (1.0F - ring * 0.25F);
                        if (ringAlpha <= 0.0F) continue;

                        float prevX = radius;
                        float prevZ = 0.0F;

                        for (int i = 1; i <= SEGMENTS; i++) {
                            double angle = i / (double)SEGMENTS * Math.PI * 2.0;
                            float x = (float)(Math.cos(angle) * radius);
                            float z = (float)(Math.sin(angle) * radius);
                            float dx = x - prevX;
                            float dz = z - prevZ;
                            float len = (float)Math.sqrt(dx * dx + dz * dz);
                            if (len > 1.0E-5F) {
                                dx /= len;
                                dz /= len;
                            }

                            buf.addVertex(pose, prevX, 0.0F, prevZ)
                                    .setColor(1.0F, 1.0F, 1.0F, ringAlpha)
                                    .setNormal(pose, dx, 0.0F, dz)
                                    .setLineWidth(2.0F);
                            buf.addVertex(pose, x, 0.0F, z)
                                    .setColor(1.0F, 1.0F, 1.0F, ringAlpha)
                                    .setNormal(pose, dx, 0.0F, dz)
                                    .setLineWidth(2.0F);

                            prevX = x;
                            prevZ = z;
                        }
                    }
                }
        );

        matrices.popPose();
    }
}
''', encoding="utf-8")
    changed.append(str(shockwave.relative_to(root)) + " (restored 26.3 shockwave renderer)")

print("Patched files:")
for p in sorted(set(changed)):
    print(" -", p)
