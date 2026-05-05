'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text3D, Center, OrbitControls, MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

export default function ParallaxDivider() {
  const sphereRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.5;
    }
  });

  return (
    <div className="relative h-40 w-full my-[-80px] z-10">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-50 to-white pointer-events-none" />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-10 top-1/2 -translate-y-1/2">
          <Sphere ref={sphereRef} args={[1, 64, 64]}>
            <MeshDistortMaterial
              color="#6366f1"
              attach="material"
              distort={0.4}
              speed={2}
              roughness={0.2}
              metalness={0.8}
            />
          </Sphere>
        </div>
        <div className="absolute right-20 top-1/2 -translate-y-1/2">
          <Sphere args={[0.6, 32, 32]}>
            <MeshDistortMaterial
              color="#8b5cf6"
              attach="material"
              distort={0.3}
              speed={1.5}
              roughness={0.3}
              metalness={0.7}
            />
          </Sphere>
        </div>
        <div className="absolute left-1/2 top-full">
          {/* Left empty for spacing */}
        </div>
      </div>
    </div>
  );
}
