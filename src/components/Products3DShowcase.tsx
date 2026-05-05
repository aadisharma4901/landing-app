'use client';

import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Torus, Environment } from '@react-three/drei';
import { useRef } from 'react';

function FloatingOrb({ position, color, size = 1, speed = 1 }: { position: [number, number, number], color: string, size?: number, speed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.004 * speed;
      meshRef.current.rotation.y += 0.006 * speed;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 * speed) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial 
          color={color}
          metalness={0.6}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.1}
        />
      </mesh>
    </Float>
  );
}

function AnimatedTorus({ position, color }: { position: [number, number, number], color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.004;
      meshRef.current.rotation.z += 0.003;
      meshRef.current.position.y = position[1] + Math.cos(state.clock.elapsedTime * 0.4) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        <torusGeometry args={[0.5, 0.2, 32, 100]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.5} 
          roughness={0.3} 
        />
      </mesh>
    </Float>
  );
}

export default function Products3DShowcase() {;

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-zinc-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-4">
            Explore Our Collection
          </h2>
          <p className="text-zinc-600">Interactive 3D preview of our most loved products</p>
        </div>

        <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl">
          <Canvas
            shadows
            camera={{ position: [0, 2, 6], fov: 50 }}
            dpr={[1, 2]}
            onPointerMissed={() => {}}
          >
            <color attach="background" args={['#f8fafc']} />
            <fog attach="fog" args={['#f8fafc', 5, 15]} />
            
            <ambientLight intensity={0.5} />
            <directionalLight
              position={[5, 5, 5]}
              intensity={1}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />
            <spotLight position={[-5, 5, 0]} intensity={0.5} angle={0.3} penumbra={1} />
            <pointLight position={[0, -5, 0]} intensity={0.5} color="#60a5fa" />
            
            <FloatingOrb position={[-2.5, 0.5, 0]} color="#6366f1" size={0.8} speed={1} />
            <FloatingOrb position={[0, 1, -1]} color="#8b5cf6" size={0.6} speed={1.3} />
            <FloatingOrb position={[2.5, 0, 0.5]} color="#06b6d4" size={0.7} speed={0.9} />
            <AnimatedTorus position={[0, -1, 1]} color="#f59e0b" />
            
            <Environment preset="city" />
          </Canvas>
          
          {/* 3D scene overlay */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
            <span className="px-4 py-2 bg-white/80 backdrop-blur-md rounded-full text-sm text-zinc-700 shadow-lg">
              Drag to explore ✨
            </span>
          </div>
        </div>

        {/* Product tags floating over 3D */}
        <div className="absolute top-1/4 left-1/4 hidden lg:block pointer-events-none">
          <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-zinc-100">
            <span className="text-sm font-semibold text-zinc-900">Laptops</span>
            <span className="ml-2 text-green-500">from $299</span>
          </div>
        </div>
      </div>
    </section>
  );
}
