"use client";

import * as THREE from "three";
import { useRef } from "react";
import { usePathname } from "next/navigation";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Lake } from "./components/lake";
import { Mountains } from "./components/mountains";
import { ShoreRock } from "./components/shorerock";
import { ShoreRocks } from "./components/shorerock";
import { Grass } from "./components/grass";
import { Signpost } from "./components/signpost";


const POSES = {
  "/":        { pos: [0, 20.5, 31], target: [0, 5, -6] },   // overhead, on the lake
  "/contact": { pos: [0, 24, 30],   target: [0, 30, -5] },  // tilted up, at the sky
};

function CameraRig() {
  const { camera } = useThree();
  const pathname = usePathname();

  // the eased "base" position, and the point we're looking at
  const base = useRef(new THREE.Vector3(0, 20.5, 31));
  const look = useRef(new THREE.Vector3(0, 5, -6));

  useFrame((state) => {
    const pose = POSES[pathname] ?? POSES["/"]; // unknown routes fall back to home

    // ease a fraction of the way toward the target pose each frame
    base.current.lerp(new THREE.Vector3(...pose.pos), 0.04);
    look.current.lerp(new THREE.Vector3(...pose.target), 0.04);

    // gentle sway, layered on top of the eased base
    const t = state.clock.elapsedTime;
    camera.position.set(
      base.current.x + Math.sin(t * 0.12) * 1.4,
      base.current.y,
      base.current.z + Math.cos(t * 0.1) * 0.8
    );
    camera.lookAt(look.current);
  });

  return null;
}

const FIREFLY_SPOTS = [
  [88, 18], [68, 30], [31, 38], [12, 64], [83, 70], [46, 12], [60, 58],
];

function Fireflies() {
  return (
    <>
      {FIREFLY_SPOTS.map(([x, y], i) => (
        <span
          key={i}
          className="fly"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            "--d": `${(7 + (i % 4) * 1.5).toFixed(1)}s`,
            "--p": `${(2.6 + (i % 3) * 0.8).toFixed(1)}s`,
            "--dx": `${(i % 2 ? 1 : -1) * (6 + i)}px`,
            "--dy": `${-8 - i * 2}px`,
          }}
        />
      ))}
    </>
  );
}

export default function Landing() {
  return (
    <div className="scene">
      <Canvas
        className="gl"
        camera={{ position: [0, 10.5, 10], fov: 50 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
      >
        <CameraRig />
        <ambientLight color="#b9c4ff" intensity={0.85} />
        <directionalLight color="#ffe9d6" intensity={0.9} position={[-6, 9, 6]} />
        <directionalLight color="#c9a9cf" intensity={0.55} position={[5, 4, -8]} />
        <Mountains />
        <ShoreRocks />
        <Lake />
        <Grass position={[3, 7, 19]} area={[7, 7]} count={500} />
        <Grass position={[-4.5, 9, 19]} area={[7, 7]} count={500} />
        <Grass position={[-10, 11, 19]} area={[7, 7]} count={500} />
        <Grass position={[10.2, 9, 19]} area={[7, 7]} count={500} />
        <Signpost position={[10, 9, 19]} scale={1.4} />
      </Canvas>

      <div className="vignette" />
      <Fireflies />
    </div>
  );
}