#!/usr/bin/env python3
from pathlib import Path
import re
import sys
import subprocess
import json

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



# Restore the first-person arm transforms that the upstream 26.3 port left in
# disabled-code. renderMapHand remains available with SubmitNodeCollector.
held_mixin = root / "src/main/java/com/cooptest/mixin/client/HeldItemRendererMixin.java"
held_mixin.parent.mkdir(parents=True, exist_ok=True)
held_mixin.write_text(r'''package com.cooptest.mixin.client;

import com.cooptest.ArmPoseTracker;
import com.cooptest.GrabInputHandler;
import com.cooptest.PoseNetworking;
import com.cooptest.PoseState;
import com.mojang.blaze3d.vertex.PoseStack;
import com.mojang.math.Axis;
import java.util.UUID;
import net.minecraft.client.Minecraft;
import net.minecraft.client.renderer.ItemInHandRenderer;
import net.minecraft.client.renderer.SubmitNodeCollector;
import net.minecraft.world.entity.HumanoidArm;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Unique;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

@Mixin(ItemInHandRenderer.class)
public class HeldItemRendererMixin {
    @Unique private static final float READY_UP = 1.2F;
    @Unique private static final float READY_FORWARD = 0.8F;
    @Unique private static final float READY_PITCH = -85.0F;
    @Unique private static final float HOLD_UP = 1.5F;
    @Unique private static final float HOLD_FORWARD = 0.3F;
    @Unique private static final float HOLD_PITCH = -95.0F;
    @Unique private static final float CHARGE_UP = 0.8F;
    @Unique private static final float CHARGE_FORWARD = -0.5F;
    @Unique private static final float CHARGE_PITCH = -60.0F;
    @Unique private static final float CHARGE_SHAKE = 0.08F;
    @Unique private static final float THROW_DURATION = 300.0F;
    @Unique private static final float PUSH_IDLE_UP = 0.4F;
    @Unique private static final float PUSH_IDLE_FORWARD = 0.5F;
    @Unique private static final float PUSH_IDLE_PITCH = -50.0F;
    @Unique private static final float PUSH_ACTION_UP = 0.6F;
    @Unique private static final float PUSH_ACTION_FORWARD = 1.0F;
    @Unique private static final float PUSH_ACTION_PITCH = -80.0F;
    @Unique private static final float LERP_SPEED = 0.25F;
    @Unique private static final float FAST_LERP = 0.4F;
    @Unique private static float currUp = 0.0F;
    @Unique private static float currForward = 0.0F;
    @Unique private static float currPitch = 0.0F;
    @Unique private static long throwStartTime = 0L;
    @Unique private static boolean wasHolding = false;

    @Inject(method = "renderMapHand", at = @At("HEAD"))
    private void coop$onRenderArm(PoseStack matrices, SubmitNodeCollector queue,
                                  int light, HumanoidArm arm, CallbackInfo ci) {
        Minecraft client = Minecraft.getInstance();
        if (client.player == null) return;

        boolean handsEmpty = client.player.getMainHandItem().isEmpty()
                && client.player.getOffhandItem().isEmpty();
        UUID playerId = client.player.getUUID();
        PoseState pose = PoseNetworking.poseStates.getOrDefault(playerId, PoseState.NONE);

        boolean isHolding = pose == PoseState.GRAB_HOLDING;
        if (wasHolding && !isHolding && pose == PoseState.GRAB_READY) {
            throwStartTime = System.currentTimeMillis();
        }
        wasHolding = isHolding;

        Long trackerThrowStart = ArmPoseTracker.throwAnimationStart.get(playerId);
        if (trackerThrowStart != null) {
            throwStartTime = trackerThrowStart;
        }

        float targetUp = 0.0F;
        float targetForward = 0.0F;
        float targetPitch = 0.0F;
        float lerpSpeed = LERP_SPEED;
        float shakeAmount = 0.0F;
        boolean inThrowAnim = false;
        float throwProgress = 0.0F;

        if (throwStartTime > 0L) {
            long elapsed = System.currentTimeMillis() - throwStartTime;
            if ((float)elapsed < THROW_DURATION) {
                inThrowAnim = true;
                throwProgress = (float)elapsed / THROW_DURATION;
            } else {
                throwStartTime = 0L;
            }
        }

        if (inThrowAnim) {
            lerpSpeed = FAST_LERP;
            if (throwProgress < 0.3F) {
                float p = throwProgress / 0.3F;
                targetUp = lerp(HOLD_UP, 0.3F, p);
                targetForward = lerp(HOLD_FORWARD, 1.2F, p);
                targetPitch = lerp(HOLD_PITCH, -100.0F, p);
            } else {
                float p = (throwProgress - 0.3F) / 0.7F;
                targetUp = lerp(0.3F, 0.0F, p);
                targetForward = lerp(1.2F, 0.0F, p);
                targetPitch = lerp(-100.0F, 0.0F, p);
            }
        } else if (handsEmpty && pose != PoseState.NONE && pose != PoseState.GRABBED) {
            float charge = GrabInputHandler.getThrowChargeProgress();
            boolean isCharging = charge >= 0.0F;

            switch (pose) {
                case GRAB_READY -> {
                    targetUp = READY_UP;
                    targetForward = READY_FORWARD;
                    targetPitch = READY_PITCH;
                }
                case GRAB_HOLDING -> {
                    if (isCharging) {
                        targetUp = lerp(HOLD_UP, CHARGE_UP, charge);
                        targetForward = lerp(HOLD_FORWARD, CHARGE_FORWARD, charge);
                        targetPitch = lerp(HOLD_PITCH, CHARGE_PITCH, charge);
                        if (charge > 0.5F) {
                            shakeAmount = CHARGE_SHAKE * (charge - 0.5F) * 2.0F;
                        }
                    } else {
                        targetUp = HOLD_UP;
                        targetForward = HOLD_FORWARD;
                        targetPitch = HOLD_PITCH;
                    }
                }
                case PUSH_IDLE, PUSH_RETURN -> {
                    targetUp = PUSH_IDLE_UP;
                    targetForward = PUSH_IDLE_FORWARD;
                    targetPitch = PUSH_IDLE_PITCH;
                }
                case PUSH_ACTION -> {
                    targetUp = PUSH_ACTION_UP;
                    targetForward = PUSH_ACTION_FORWARD;
                    targetPitch = PUSH_ACTION_PITCH;
                    lerpSpeed = FAST_LERP;
                }
            }
        }

        currUp = lerp(currUp, targetUp, lerpSpeed);
        currForward = lerp(currForward, targetForward, lerpSpeed);
        currPitch = lerp(currPitch, targetPitch, lerpSpeed);

        float shakeOffset = 0.0F;
        if (shakeAmount > 0.0F) {
            shakeOffset = (float)(Math.random() - 0.5) * shakeAmount;
        }

        if (Math.abs(currPitch) < 1.0F
                && Math.abs(currUp) < 0.01F
                && Math.abs(currForward) < 0.01F) {
            return;
        }

        matrices.translate(0.0, currUp + shakeOffset, -currForward + shakeOffset * 0.5F);
        matrices.mulPose(Axis.XP.rotationDegrees(currPitch + shakeOffset * 20.0F));
    }

    @Unique
    private static float lerp(float a, float b, float t) {
        return a + (b - a) * t;
    }
}
''', encoding="utf-8")
changed.append(str(held_mixin.relative_to(root)) + " (restored first-person pose mixin)")

# 26.2+ renamed renderArmWithItem -> submitArmWithItem while preserving the
# argument layout. Restore the full-bright impact light modifier against the new name.
impact_mixin = root / "src/main/java/com/cooptest/mixin/client/impactframemixin/HeldItemRendererImpactMixin.java"
impact_mixin.parent.mkdir(parents=True, exist_ok=True)
impact_mixin.write_text(r'''package com.cooptest.mixin.client.impactframemixin;

import com.cooptest.client.CoopImpactHandler;
import net.fabricmc.api.EnvType;
import net.fabricmc.api.Environment;
import net.minecraft.client.renderer.ItemInHandRenderer;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.ModifyVariable;

@Environment(EnvType.CLIENT)
@Mixin(ItemInHandRenderer.class)
public class HeldItemRendererImpactMixin {
    @ModifyVariable(method = "submitArmWithItem", at = @At("HEAD"), argsOnly = true, ordinal = 0)
    private int coop$forceLight(int light) {
        return CoopImpactHandler.playing ? 15728880 : light;
    }
}
''', encoding="utf-8")
changed.append(str(impact_mixin.relative_to(root)) + " (restored 26.3 impact hand mixin)")

# Register the restored client mixins.
mixins = root / "src/main/resources/testcoop.mixins.json"
if mixins.exists():
    data = json.loads(mixins.read_text(encoding="utf-8"))
    client_mixins = data.setdefault("client", [])
    for entry in (
        "client.HeldItemRendererMixin",
        "client.impactframemixin.HeldItemRendererImpactMixin",
    ):
        if entry not in client_mixins:
            client_mixins.append(entry)
    data["compatibilityLevel"] = "JAVA_25"
    mixins.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
    changed.append(str(mixins.relative_to(root)) + " (registered restored first-person mixins)")

# Remove two invalid, unused legacy assets that 26.3 rejects during resource scanning.
bad_mp3 = root / "src/main/resources/assets/testcoop/sounds/pefectdap.MP3"
if bad_mp3.exists():
    bad_mp3.unlink()
    changed.append(str(bad_mp3.relative_to(root)) + " (removed invalid unused MP3 asset)")

bad_anim = root / "src/main/resources/assets/testcoop/player_animations/dap _hold.json"
if bad_anim.exists():
    bad_anim.unlink()
    changed.append(str(bad_anim.relative_to(root)) + " (removed invalid duplicate animation path)")

# The upstream mahito.png is actually WebP data with a .png suffix.
# Convert it to a genuine PNG so Minecraft's PNG loader can decode it.
mahito = root / "src/main/resources/assets/testcoop/textures/mob_effect/mahito.png"
if mahito.exists():
    header = mahito.read_bytes()[:12]
    if not header.startswith(b"\x89PNG\r\n\x1a\n"):
        converted = mahito.with_name("mahito.converted.png")
        subprocess.run(["convert", str(mahito), "PNG:" + str(converted)], check=True)
        converted.replace(mahito)
        changed.append(str(mahito.relative_to(root)) + " (converted WebP payload to real PNG)")

print("Patched files:")
for p in sorted(set(changed)):
    print(" -", p)
