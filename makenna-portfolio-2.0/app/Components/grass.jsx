import { useMemo, useRef, useLayoutEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ---- Grass look knobs ----
const BLADE_H = 1.6;          // how tall each blade is
const BLADE_W = 0.5;          // how wide each blade is
const BASE_COLOR = "#30677E"; // color at the bottom of the blade
const TIP_COLOR = "#61A77A";  // color at the tip
const WIND = 0.20;            // how far blades sway
const SPEED = 1.6;            // how fast they sway

// A patch of wind-animated grass.
// Use: <Grass position={[x, y, z]} area={[width, depth]} count={3000} />
export function Grass({ position = [0, 0, 0], area = [30, 30], count = 3000 }) {
  const meshRef = useRef();
  const timeUniform = useRef({ value: 0 });

  // One blade: a tapered plane with a base->tip color gradient baked in.
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(BLADE_W, BLADE_H, 1, 4);
    g.translate(0, BLADE_H / 2, 0); // move pivot to the base so it bends from the ground

    const pos = g.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const base = new THREE.Color(BASE_COLOR);
    const tip = new THREE.Color(TIP_COLOR);
    const c = new THREE.Color();

    for (let i = 0; i < pos.count; i++) {
      const t = pos.getY(i) / BLADE_H; // 0 at base, 1 at tip
      pos.setX(i, pos.getX(i) * (1 - 0.8 * t)); // taper to a point
      c.copy(base).lerp(tip, t);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return g;
  }, []);

  // A normal lit material, with a few lines of wind-bending injected into it.
  const material = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      vertexColors: true,
      side: THREE.DoubleSide,
      roughness: 1,
      metalness: 0,
    });
    m.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = timeUniform.current;
      shader.vertexShader =
        "uniform float uTime;\n" +
        shader.vertexShader.replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
           float h = clamp(position.y / ${BLADE_H.toFixed(2)}, 0.0, 1.0);
           float phase = instanceMatrix[3].x * 0.6 + instanceMatrix[3].z * 0.6;
           float sway = sin(uTime * ${SPEED.toFixed(2)} + phase);
           float bend = sway * ${WIND.toFixed(2)} * h * h;  // tip bends most, base stays
           transformed.x += bend;
           transformed.z += bend * 0.5;
          `
        );
    };
    return m;
  }, []);

  // Scatter the blades across the patch with random spot, spin, and size.
  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();
    const [w, d] = area;
    for (let i = 0; i < count; i++) {
      dummy.position.set((Math.random() - 0.5) * w, 0, (Math.random() - 0.5) * d);
      dummy.rotation.y = Math.random() * Math.PI;
      dummy.scale.setScalar(0.7 + Math.random() * 0.7);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [count, area]);

  useFrame((state) => {
    timeUniform.current.value = state.clock.elapsedTime;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, count]}
      position={position}
      frustumCulled={false}
    />
  );
}