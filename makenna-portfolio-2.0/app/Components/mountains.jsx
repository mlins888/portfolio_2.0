import { useMemo } from "react";
import * as THREE from "three";

// Back-to-front: cooler & lighter in the distance, deeper teal up close.
// Real 3D low-poly mountains, built from cone "peaks" instead of flat walls.
// Each entry below is one peak. Add, remove, move, and resize them freely.
//   x, z  = where it sits on the ground (z more negative = further back)
//   r     = base radius (how wide it is)
//   h     = how tall it is
//   seg   = number of sides — 4 = sharp pyramid, 6-7 = rounder mountain
//   color = its color
const PEAKS = [
  // ---- behind the lake (far side) ----
  { x: -24, z: -32, r: 14, h: 16, seg: 6, color: "#7c8ab3" },
  { x:   -16, z: -42, r: 19, h: 24, seg: 7, color: "#5d6ba0" }, // tallest, back-center
  { x:  0, z: -32, r: 14, h: 17, seg: 5, color: "#7488b4" },
  { x: -4, z: -32, r: 14, h: 6, seg: 6, color: "#7c8ab3" }, //small rock
  { x: 30, z: -12, r: 14, h: 6, seg: 6, color: "#7c7eb3" }, //small rock
  { x:   16, z: -52, r: 19, h: 24, seg: 7, color: "#5d6ba0" }, // tallest, back-center
  { x:  20, z: -32, r: 14, h: 17, seg: 5, color: "#7480b4" },
  // ---- right bank ----
  { x:  24, z: -24, r: 12, h: 14, seg: 5, color: "#566a9c" },
  { x:  30, z:   0, r: 13, h: 15, seg: 6, color: "#4a6a86" },
  { x:  20, z:  22, r:  9, h: 10, seg: 4, color: "#3f5f7a" }, // small, front-right
  // ---- left bank ----
  { x: -12, z:  18, r:  9, h: 10, seg: 4, color: "#3f467a" }, // small, front-left
  { x: -32, z:  -2, r: 13, h: 15, seg: 6, color: "#4a6a86" },
  { x: -34, z: -26, r: 12, h: 14, seg: 5, color: "#566a9c" },
  { x: -30, z: -16, r: 12, h: 14, seg: 5, color: "#566a9c" }
];

// Height at which every peak's base sits (just below the lake surface).
const GROUND_Y = -1.5;

export function Mountains() {
  return (
    <>
      {PEAKS.map((p, i) => (
        // position.y is set so the BASE rests on GROUND_Y (a cone is centered
        // on its middle, so we lift it by half its height).
        <mesh key={i} position={[p.x, GROUND_Y + p.h / 2, p.z]}>
          <coneGeometry args={[p.r, p.h, p.seg]} />
          <meshStandardMaterial
            color={p.color}
            flatShading
            roughness={0.85}
            metalness={0.05}
          />
        </mesh>
      ))}
    </>
  );
}