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




# Restore the two post-effect chains/resources from the supplied 3.0.0 build.
post_effect_dir = root / "src/main/resources/assets/cooptest/post_effect"
post_shader_dir = root / "src/main/resources/assets/cooptest/shaders/post"
post_effect_dir.mkdir(parents=True, exist_ok=True)
post_shader_dir.mkdir(parents=True, exist_ok=True)

(post_effect_dir / "chroma.json").write_text(r'''{
  "targets": { "swap": {} },
  "passes": [
    {
      "vertex_shader": "minecraft:core/screenquad",
      "fragment_shader": "minecraft:post/blit",
      "inputs": [
        { "sampler_name": "In", "target": "minecraft:main" }
      ],
      "uniforms": {
        "BlitConfig": [
          { "name": "ColorModulate", "type": "vec4", "value": [1.0, 1.0, 1.0, 1.0] }
        ]
      },
      "output": "swap"
    },
    {
      "vertex_shader": "minecraft:core/screenquad",
      "fragment_shader": "cooptest:post/chroma",
      "inputs": [
        { "sampler_name": "In", "target": "swap" }
      ],
      "uniforms": {
        "ChromaConfig": [
          { "name": "ChromaOffset", "type": "float", "value": 0.05 }
        ]
      },
      "output": "minecraft:main"
    }
  ]
}
''', encoding="utf-8")

(post_effect_dir / "radialblur.json").write_text(r'''{
  "targets": { "swap": {} },
  "passes": [
    {
      "vertex_shader": "minecraft:core/screenquad",
      "fragment_shader": "minecraft:post/blit",
      "inputs": [
        { "sampler_name": "In", "target": "minecraft:main" }
      ],
      "uniforms": {
        "BlitConfig": [
          { "name": "ColorModulate", "type": "vec4", "value": [1.0, 1.0, 1.0, 1.0] }
        ]
      },
      "output": "swap"
    },
    {
      "vertex_shader": "minecraft:core/screenquad",
      "fragment_shader": "cooptest:post/radialblur",
      "inputs": [
        { "sampler_name": "In", "target": "swap" }
      ],
      "uniforms": {
        "RadialBlurConfig": [
          { "name": "BlurStrength", "type": "float", "value": 0.035 },
          { "name": "Samples", "type": "float", "value": 8.0 }
        ]
      },
      "output": "minecraft:main"
    }
  ]
}
''', encoding="utf-8")

(post_shader_dir / "chroma.fsh").write_text(r'''#version 330

uniform sampler2D InSampler;
in vec2 texCoord;

layout(std140) uniform ChromaConfig {
    float ChromaOffset;
};

out vec4 fragColor;

void main() {
    vec2 dir = texCoord - vec2(0.5);
    float dist = length(dir);
    vec2 offset = (dist > 0.001)
        ? normalize(dir) * ChromaOffset * dist * 2.0
        : vec2(0.0);

    float r = texture(InSampler, texCoord + offset).r;
    float g = texture(InSampler, texCoord).g;
    float b = texture(InSampler, texCoord - offset).b;
    fragColor = vec4(r, g, b, 1.0);
}
''', encoding="utf-8")

(post_shader_dir / "radialblur.fsh").write_text(r'''#version 330

uniform sampler2D InSampler;
in vec2 texCoord;

layout(std140) uniform RadialBlurConfig {
    float BlurStrength;
    float Samples;
};

out vec4 fragColor;

void main() {
    vec2 dir = texCoord - vec2(0.5);
    vec2 stepv = dir * (BlurStrength / Samples);
    vec4 color = vec4(0.0);
    float total = 0.0;

    for (float i = 0.0; i < Samples; i++) {
        float weight = (Samples - i) / Samples;
        color += texture(InSampler, texCoord - stepv * i) * weight;
        total += weight;
    }

    fragColor = color / total;
}
''', encoding="utf-8")
changed.extend([
    "src/main/resources/assets/cooptest/post_effect/chroma.json (restored)",
    "src/main/resources/assets/cooptest/post_effect/radialblur.json (restored)",
    "src/main/resources/assets/cooptest/shaders/post/chroma.fsh (restored)",
    "src/main/resources/assets/cooptest/shaders/post/radialblur.fsh (restored)",
])

# Re-enable GameRenderer's native named post-effect mechanism. In modern
# Minecraft setPostEffect is private, so expose it as a Mixin invoker.
post_mixin = root / "src/main/java/com/cooptest/mixin/client/impactframemixin/CoopGameRendererMixin.java"
if post_mixin.exists():
    post_mixin.write_text(r'''package com.cooptest.mixin.client.impactframemixin;

import com.cooptest.client.CoopChromaHandler;
import com.cooptest.client.CoopRadialBlurHandler;
import net.fabricmc.api.EnvType;
import net.fabricmc.api.Environment;
import net.minecraft.client.DeltaTracker;
import net.minecraft.client.renderer.GameRenderer;
import net.minecraft.resources.Identifier;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Unique;
import org.spongepowered.asm.mixin.gen.Invoker;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

@Environment(EnvType.CLIENT)
@Mixin(GameRenderer.class)
public abstract class CoopGameRendererMixin {
    @Unique
    private static final Identifier coop$CHROMA_ID =
            Identifier.fromNamespaceAndPath("cooptest", "chroma");
    @Unique
    private static final Identifier coop$RADIAL_ID =
            Identifier.fromNamespaceAndPath("cooptest", "radialblur");
    @Unique private static boolean coop$chromaLoaded = false;
    @Unique private static boolean coop$radialLoaded = false;
    @Unique private static boolean coop$chromaBroken = false;
    @Unique private static boolean coop$radialBroken = false;

    @Invoker("setPostEffect")
    protected abstract void coop$setPostEffect(Identifier id);

    @Inject(method = "extract", at = @At("HEAD"))
    private void coop$handlePostEffects(DeltaTracker counter, boolean tick, CallbackInfo ci) {
        boolean wantRadial = CoopRadialBlurHandler.isActive() && !coop$radialBroken;
        boolean wantChroma = CoopChromaHandler.isActive() && !coop$chromaBroken;

        if (wantRadial) {
            if (!coop$radialLoaded) {
                if (coop$trySet(coop$RADIAL_ID, "radialblur")) {
                    coop$radialLoaded = true;
                    coop$chromaLoaded = false;
                } else {
                    coop$radialBroken = true;
                }
            }
        } else if (wantChroma) {
            if (!coop$chromaLoaded) {
                if (coop$trySet(coop$CHROMA_ID, "chroma")) {
                    coop$chromaLoaded = true;
                    coop$radialLoaded = false;
                } else {
                    coop$chromaBroken = true;
                }
            }
        } else if (coop$chromaLoaded || coop$radialLoaded) {
            try {
                ((GameRenderer)(Object)this).clearPostEffect();
            } catch (Throwable ignored) {
            }
            coop$chromaLoaded = false;
            coop$radialLoaded = false;
        }
    }

    @Unique
    private boolean coop$trySet(Identifier id, String name) {
        try {
            this.coop$setPostEffect(id);
            return true;
        } catch (Throwable t) {
            System.err.println(
                    "[COOP] post effect '" + name
                            + "' failed to load and is disabled for this session. Cause: " + t
            );
            t.printStackTrace();
            try {
                ((GameRenderer)(Object)this).clearPostEffect();
            } catch (Throwable ignored) {
            }
            return false;
        }
    }
}
''', encoding="utf-8")
    changed.append(str(post_mixin.relative_to(root)) + " (restored post effects)")

# Restore Heaven impact's world-color clear at the closest 26.3 phase:
# after opaque terrain and before submitted entity geometry is drawn.
heaven = root / "src/main/java/com/cooptest/client/HeavenDapClientHandler.java"
if heaven.exists():
    src = heaven.read_text(encoding="utf-8")
    old = "      // TODO(26.3 port): BEFORE_ENTITIES was removed; the screen-clear effect is disabled.\\n      LevelRenderEvents.END_MAIN.register(CoopShockwaveRenderer::render);"
    new = """      LevelRenderEvents.AFTER_OPAQUE_TERRAIN.register(ctx -> {
         if (CoopImpactHandler.playing) {
            int argb = switch (CoopImpactHandler.currentFrameType) {
               case BLACK -> -16777216;
               case INVERT -> -16777216;
               case WHITE -> -1;
               case RED -> -65536;
               case CYAN -> -16711681;
            };
            Minecraft client = Minecraft.getInstance();
            RenderSystem.getDevice().createCommandEncoder()
               .clearColorTexture(client.getMainRenderTarget().getColorTexture(), argb);
         }
      });
      LevelRenderEvents.END_MAIN.register(CoopShockwaveRenderer::render);"""
    if old in src:
        heaven.write_text(src.replace(old, new), encoding="utf-8")
        changed.append(str(heaven.relative_to(root)) + " (restored Heaven world-color impact frames)")

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
