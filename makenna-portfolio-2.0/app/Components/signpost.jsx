"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Text } from "@react-three/drei";

// ---- The signs. Each board links to a page. Edit freely. ----
//   label    = text on the board (arrows are just characters)
//   path     = the route it navigates to (this page must exist!)
//   y        = height up the post
//   rotation = slight turn for character (radians)
//   color    = board color
const SIGNS = [
  { label: "WORK \u2192", path: "/work", y: 4.6, rotation: 0.12, color: "#5DA79E" },
  { label: "\u2190 ABOUT", path: "/about", y: 3.3, rotation: -0.12, color: "#6f7fa0" },
  { label: "CONTACT \u2192", path: "/contact", y: 2.0, rotation: 0.06, color: "#9a6f8a" },
];

const POST_COLOR = "#5b463a";
const POST_HEIGHT = 6.4; // length of the pole

function Sign({ label, path, y, rotation, color }) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  return (
    <group
      position={[0, y, 0]}
      rotation={[0, rotation, 0]}
      scale={hovered ? 1.06 : 1}
      onClick={(e) => {
        e.stopPropagation();
        router.push(path); // change pages
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      {/* the board, offset so the post sits near its right end */}
      <mesh position={[-1.4, 1, 0]}>
        <boxGeometry args={[3.6, 1.0, 0.2]} />
        <meshStandardMaterial color={hovered ? "#e6d2a0" : color} flatShading roughness={0.9} />
      </mesh>
      {/* the readable label sitting on the board's front face */}
      <Text position={[-1.6, 1, 0.12]} fontSize={0.5} color="#2b231c" anchorX="center" anchorY="middle">
        {label}
      </Text>
    </group>
  );
}

// Place it with: <Signpost position={[x, y, z]} scale={1.4} />
export function Signpost({ position = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      {/* the post */}
      <mesh position={[0, POST_HEIGHT / 2, 0]}>
        <boxGeometry args={[0.4, POST_HEIGHT, 0.4]} />
        <meshStandardMaterial color={POST_COLOR} flatShading roughness={0.95} />
      </mesh>
      {/* a little cap on top */}
      <mesh position={[0, 6.5, 0]}>
        <boxGeometry args={[0.7, 0.3, 0.7]} />
        <meshStandardMaterial color={POST_COLOR} flatShading roughness={0.95} />
      </mesh>
      {SIGNS.map((s, i) => (
        <Sign key={i} {...s} />
      ))}
    </group>
  );
}