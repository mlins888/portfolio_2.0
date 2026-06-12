import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const FAR  = new THREE.Color("#9666cd");  // violet, by the mountains
const MID  = new THREE.Color("#3a76d0");  // blue, middle
const NEAR = new THREE.Color("#15c5b8");  // vivid teal, closest edge

// The rippling low-poly lake. A flat plane of triangles whose vertices
// rise and fall each frame; flatShading + recomputed normals make the
// facets catch the light, which is the whole "rippling water" effect.
export function Lake() {
  // Build the water grid once. Higher segment counts = finer ripples.
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(40, 28, 32, 22);
    const pos = g.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const c = new THREE.Color();

    let minY = Infinity;
    let maxY = -Infinity;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }

    for (let i = 0; i < pos.count; i++) {
      const t = (pos.getY(i) - minY) / (maxY - minY); // 0 = far, 1 = near
      if (t < 0.5) c.copy(FAR).lerp(MID, t / 0.5);
      else c.copy(MID).lerp(NEAR, (t - 0.5) / 0.5);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return g;
  }, []);

  // Cache every vertex's resting x/y so we can re-displace it each frame.
  const base = useMemo(() => {
    const pos = geo.attributes.position;
    const arr = new Float32Array(pos.count * 2);
    for (let i = 0; i < pos.count; i++) {
      arr[i * 2] = pos.getX(i);
      arr[i * 2 + 1] = pos.getY(i);
    }
    return arr;
  }, [geo]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = base[i * 2];
      const y = base[i * 2 + 1];
      // A few layered sine waves = cheap, convincing water motion.
      pos.setZ(
        i,
        //First line x multiplier = tightness
        //First line final multiplier = height
        Math.sin(x * 0.58 + t * 1.1) * 0.45 +
          Math.sin(y * 0.34 - t * 0.7) * 0.4 +
          Math.sin((x + y) * 0.42 + t * 1.6) * 0.28 +
          Math.sin((x * 0.6 - y * 0.4) + t * 0.6) * 0.22
      );
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals(); // re-shade the facets so they shimmer
  });

  return (
    <mesh geometry={geo} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, -6]}>
      <meshStandardMaterial
        vertexColors
        color="#ffffff"
        flatShading
        metalness={0.45}
        roughness={0.6}
        emissive="#0a2230"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}