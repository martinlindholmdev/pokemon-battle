import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { BattleMove, FriendSide } from "../api/http";

type ArenaSide = "player" | "opponent" | FriendSide;

interface BattleArena3DProps {
  activeSide?: ArenaSide;
  lastMove?: BattleMove;
  finished?: boolean;
}

const crowdDots = Array.from({ length: 36 }, (_, index) => {
  const angle = (index / 36) * Math.PI * 2;
  const radius = index % 2 === 0 ? 5.2 : 5.75;
  return {
    x: Math.cos(angle) * radius,
    z: Math.sin(angle) * radius,
    y: 0.45 + (index % 3) * 0.16,
    color: index % 4 === 0 ? "#ffd166" : index % 4 === 1 ? "#86c5ff" : index % 4 === 2 ? "#78d66b" : "#ffafcc"
  };
});

function isLeftSide(activeSide?: ArenaSide) {
  return activeSide === "player" || activeSide === "one";
}

function isRightSide(activeSide?: ArenaSide) {
  return activeSide === "opponent" || activeSide === "two";
}

function FighterPad({
  side,
  active,
  color
}: {
  side: "left" | "right";
  active: boolean;
  color: string;
}) {
  const group = useRef<THREE.Group>(null);
  const marker = useRef<THREE.Mesh>(null);
  const elapsed = useRef(0);
  const x = side === "left" ? -1.9 : 1.9;

  useFrame((_state, delta) => {
    elapsed.current += delta;
    if (!group.current || !marker.current) return;
    const pulse = active ? Math.sin(elapsed.current * 6) * 0.08 + 1.08 : 1;
    group.current.scale.setScalar(pulse);
    marker.current.rotation.y = elapsed.current * (active ? 1.6 : 0.35);
  });

  return (
    <group ref={group} position={[x, 0.1, 0]}>
      <mesh receiveShadow>
        <cylinderGeometry args={[1.05, 1.18, 0.24, 48]} />
        <meshStandardMaterial color={color} roughness={0.62} metalness={0.08} />
      </mesh>
      <mesh ref={marker} position={[0, 0.17, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.72, 0.035, 10, 64]} />
        <meshStandardMaterial color={active ? "#fffaf0" : "#d4cabc"} emissive={active ? color : "#000000"} emissiveIntensity={active ? 1.2 : 0.1} />
      </mesh>
      <mesh position={[0, 0.32, 0]}>
        <sphereGeometry args={[0.18, 24, 16]} />
        <meshStandardMaterial color={active ? "#fffaf0" : color} emissive={active ? color : "#000000"} emissiveIntensity={active ? 0.9 : 0.2} />
      </mesh>
    </group>
  );
}

function ArenaScene({ activeSide, lastMove, finished }: BattleArena3DProps) {
  const crowd = useRef<THREE.Group>(null);
  const spotlight = useRef<THREE.PointLight>(null);
  const movePulse = useRef<THREE.Group>(null);
  const elapsed = useRef(0);
  const leftActive = isLeftSide(activeSide);
  const rightActive = isRightSide(activeSide);
  const moveColor = lastMove === "guard" ? "#86c5ff" : lastMove === "focus" ? "#ffd166" : "#e63946";

  const sparkPositions = useMemo(
    () =>
      Array.from({ length: 14 }, (_, index) => {
        const angle = (index / 14) * Math.PI * 2;
        return [Math.cos(angle) * 0.65, 0.55 + (index % 3) * 0.08, Math.sin(angle) * 0.65] as const;
      }),
    []
  );

  useFrame((_state, delta) => {
    elapsed.current += delta;
    if (crowd.current) crowd.current.rotation.y = Math.sin(elapsed.current * 0.18) * 0.08;
    if (spotlight.current) spotlight.current.intensity = finished ? 4.8 : 3.6 + Math.sin(elapsed.current * 2) * 0.55;
    if (movePulse.current) {
      const pulse = lastMove ? 1 + Math.sin(elapsed.current * 7) * 0.09 : 1;
      movePulse.current.scale.setScalar(pulse);
      movePulse.current.rotation.y = elapsed.current * 0.8;
    }
  });

  return (
    <>
      <color attach="background" args={["#17202a"]} />
      <fog attach="fog" args={["#17202a", 7, 13]} />
      <ambientLight intensity={0.72} />
      <directionalLight position={[3, 7, 5]} intensity={2.1} />
      <pointLight ref={spotlight} position={[0, 4.2, 1.2]} color="#fffaf0" intensity={4} distance={8} />

      <group position={[0, -0.24, 0]}>
        <mesh receiveShadow>
          <cylinderGeometry args={[4.4, 4.7, 0.28, 96]} />
          <meshStandardMaterial color="#5b8d70" roughness={0.78} metalness={0.04} />
        </mesh>
        <mesh position={[0, 0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[3.75, 0.055, 12, 96]} />
          <meshStandardMaterial color="#ffd166" emissive="#8c5a00" emissiveIntensity={0.28} />
        </mesh>
        <mesh position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.05, 1.13, 64]} />
          <meshStandardMaterial color="#fffaf0" roughness={0.45} />
        </mesh>
      </group>

      <FighterPad side="left" active={leftActive} color="#2a9d8f" />
      <FighterPad side="right" active={rightActive} color="#e63946" />

      <group ref={movePulse} position={[0, 0.7, 0]}>
        {sparkPositions.map((position, index) => (
          <mesh key={index} position={position}>
            <sphereGeometry args={[0.045 + (index % 2) * 0.025, 12, 8]} />
            <meshStandardMaterial color={moveColor} emissive={moveColor} emissiveIntensity={lastMove ? 1.25 : 0.35} />
          </mesh>
        ))}
      </group>

      <group ref={crowd}>
        {crowdDots.map((dot, index) => (
          <mesh key={index} position={[dot.x, dot.y, dot.z]}>
            <boxGeometry args={[0.18, 0.28, 0.18]} />
            <meshStandardMaterial color={dot.color} emissive={dot.color} emissiveIntensity={0.18} />
          </mesh>
        ))}
      </group>
    </>
  );
}

export function BattleArena3D(props: BattleArena3DProps) {
  return (
    <div className="arena-canvas" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 4.6, 7.4], fov: 44 }}
        dpr={[1, 1.6]}
        fallback={<div className="arena-canvas__fallback" />}
      >
        <ArenaScene {...props} />
      </Canvas>
    </div>
  );
}
