"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function Particles() {
  const count = 80;
  const meshRef = useRef<THREE.Points>(null!);
  const mouseRef = useRef({ x: 0, y: 0 });

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  const colors = useMemo(() => {
    const col = new Float32Array(count * 3);
    const palette = [
      new THREE.Color("#6366f1"),
      new THREE.Color("#8b5cf6"),
      new THREE.Color("#ec4899"),
      new THREE.Color("#06b6d4"),
    ];
    for (let i = 0; i < count; i++) {
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return col;
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3 + 1] += Math.sin(time + positions[i3]) * 0.001;
      positions[i3] += Math.cos(time + positions[i3 + 2]) * 0.001;
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
    meshRef.current.rotation.y = time * 0.02;
    meshRef.current.rotation.x = Math.sin(time * 0.01) * 0.1;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

function Connections() {
  const lineRef = useRef<THREE.LineSegments>(null!);
  const count = 80;

  const [positions, pairs] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }

    const pairData: number[] = [];
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 2.5) {
          pairData.push(i, j);
        }
      }
    }
    return [pos, pairData];
  }, []);

  const linePositions = useMemo(() => {
    const data: number[] = [];
    for (let k = 0; k < pairs.length; k += 2) {
      const i = pairs[k];
      const j = pairs[k + 1];
      data.push(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      data.push(positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]);
    }
    return new Float32Array(data);
  }, [positions, pairs]);

  return (
    <lineSegments ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[linePositions, 3]}
          count={linePositions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#6366f1" opacity={0.15} transparent />
    </lineSegments>
  );
}

export default function ThreeScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 60 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true }}
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%" }}
    >
      <Particles />
      <Connections />
    </Canvas>
  );
}
