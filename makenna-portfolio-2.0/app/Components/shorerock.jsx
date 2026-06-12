import { useMemo } from "react";
import * as THREE from "three";

// ---- Look of every rock. Tweak these to restyle them all at once. ----
const SIDES = 7;            // facets around the rock (6-8 = chunky boulder)
const ROCK_COLOR = "#74716b";  // the stone
const GRASS_COLOR = "#5DA79E"; // the grassy top
const ROCK_H = 1.1;        // rock body height (smaller = flatter)
const GRASS_H = 0.32;      // thickness of the grass cap

// A single flat low-poly rock with a grassy top.
// Use: <ShoreRock position={[x, y, z]} scale={2.2} rotation={0.5} seed={3} />
export function ShoreRock({ position = [0, 0, 0], scale = 1, rotation = 0, seed = 0 }) {
  const { rockGeo, grassGeo } = useMemo(() => {
    // Same jitter for both pieces (keyed to the angle) so the grass cap
    // lines up with the rock's outline instead of drifting off it.
    const jitterAt = (a) =>
      0.92 + 0.16 * Math.sin(a * 3 + seed * 1.7) + 0.08 * Math.sin(a * 7 + seed * 3.1);

    const roughen = (geo) => {
      const p = geo.attributes.position;
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i);
        const z = p.getZ(i);
        const j = jitterAt(Math.atan2(z, x)); // center verts (x=z=0) stay put
        p.setX(i, x * j);
        p.setZ(i, z * j);
      }
      geo.computeVertexNormals();
      return geo;
    };

    // Rock body: a low prism, a touch wider at the base for a planted look.
    const rockGeo = roughen(new THREE.CylinderGeometry(0.92, 1.0, ROCK_H, SIDES));
    // Grass cap: thin, slightly wider so it overhangs and hides the seam.
    const grassGeo = roughen(new THREE.CylinderGeometry(1.06, 0.96, GRASS_H, SIDES));

    return { rockGeo, grassGeo };
  }, [seed]);

  return (
    <group position={position} scale={scale} rotation={[0, rotation, 0]}>
      <mesh geometry={rockGeo} position={[0, ROCK_H / 2, 0]}>
        <meshStandardMaterial color={ROCK_COLOR} flatShading roughness={0.95} metalness={0.02} />
      </mesh>
      <mesh geometry={grassGeo} position={[0, ROCK_H - 0.04 + GRASS_H / 2, 0]}>
        <meshStandardMaterial color={GRASS_COLOR} flatShading roughness={0.85} metalness={0} />
      </mesh>
    </group>
  );
}

// ---- A ready-made ring of rocks bordering the lake. Edit freely. ----
//   x, z = position on the shore   s = scale   rot = spin   seed = shape variety
const ROCKS = [
  { x: -15, z: -20, s: 2.2, rot: 0.4, seed: 1, h: 1.1 },
  { x: -21, z: -18, s: 2.6, rot: 1.1, seed: 2 },
  { x: 11, z: -20, s: 2.0, rot: 2.0, seed: 3 },
  { x: -20, z: -11, s: 2.4, rot: 1, seed: 4, h: 0.8 },
  { x: -24, z: -4, s: 2.1, rot: 1, seed: 5 },
  { x: 14, z: -18, s: 2.3, rot: 0.8, seed: 6 },
  { x: 5, z: -23, s: 2.5, rot: 2.4, seed: 7 },
  { x: -3, z: -18, s: 2.2, rot: 0.6, seed: 8 },
  { x: -10, z: -20, s: 2.4, rot: 1.9, seed: 9 },
  { x: 0, z: 8, s: 2.0, rot: 1.2, seed: 10 },
];

const SHORE_Y = -1.5; // base height — slightly below the water so rocks sit in the shore
const WIDTH = 2.5;    // how broad rocks are vs. their height (1 = round, higher = wider & flatter)

export function ShoreRocks() {
  return (
    <>
      {ROCKS.map((r, i) => (
        <ShoreRock
          key={i}
          position={[r.x, SHORE_Y, r.z]}
          // scale is [width, height, depth] — width/depth use WIDTH (or the
          // rock's own `w`), height stays at `s`, so bigger != taller.
          scale={[r.s * (r.w ?? WIDTH), r.s * (r.h ?? 1), r.s * (r.w ?? WIDTH)]}
          rotation={r.rot}
          seed={r.seed}
        />
      ))}
    </>
  );
}