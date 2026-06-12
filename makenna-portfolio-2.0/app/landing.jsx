"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Lake } from "./Components/lake";
import { Mountains } from "./Components/mountains";
import { ShoreRock } from "./Components/shorerock";
import { ShoreRocks } from "./Components/shorerock";
import { Grass } from "./Components/grass";

// Elevated, gently swaying camera so you look DOWN onto the lake surface.
// In 3D the geometry never changes — only where the camera sits.
function CameraRig() {
  const { camera } = useThree();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    camera.position.x = Math.sin(t * 0.12) * 1.4;
    camera.position.y = 20.5;
    camera.position.z = 31 + Math.cos(t * 0.1) * 0.8;
    camera.lookAt(0, 5, -6);
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
      </Canvas>

      <div className="vignette" />
      <Fireflies />

      <div className="title">
        <h1>MAKENNA&nbsp;LINSKY</h1>
        <p>PORTFOLIO</p>
      </div>
    </div>
  );
}