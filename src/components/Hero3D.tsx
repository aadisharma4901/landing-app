'use client';

import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sphere, Torus, Box, Icosahedron, Points, PointMaterial } from '@react-three/drei';
import { useRef, useMemo } from 'react';

function AnimatedSphere({ position, color, speed = 1 }: { position: [number, number, number], color: string, speed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005 * speed;
      meshRef.current.rotation.y += 0.007 * speed;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.3} 
          roughness={0.4}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  );
}

function AnimatedTorus({ position, color, speed = 1 }: { position: [number, number, number], color: string, speed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.006 * speed;
      meshRef.current.rotation.z += 0.004 * speed;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={2} floatIntensity={1.5}>
      <mesh ref={meshRef} position={position}>
        <torusGeometry args={[0.4, 0.15, 16, 100]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.6} 
          roughness={0.3}
          emissive={color}
          emissiveIntensity={0.15}
        />
      </mesh>
    </Float>
  );
}

function AnimatedBox({ position, color, speed = 1 }: { position: [number, number, number], color: string, speed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.004 * speed;
      meshRef.current.rotation.y += 0.006 * speed;
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={1.5} floatIntensity={2}>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.5} 
          roughness={0.2}
        />
      </mesh>
    </Float>
  );
}

function AnimatedIcosahedron({ position, color, speed = 1 }: { position: [number, number, number], color: string, speed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005 * speed;
      meshRef.current.rotation.z += 0.003 * speed;
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={1.2} floatIntensity={1.8}>
      <mesh ref={meshRef} position={position}>
        <icosahedronGeometry args={[0.45, 0]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.7} 
          roughness={0.1}
          flatShading
        />
      </mesh>
    </Float>
  );
}

function ParticleField() {
  const particlesCount = 300;
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return pos;
  }, []);

  return (
    <Points positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#94a3b8"
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  );
}

function MainGroup() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#60a5fa" />
      <pointLight position={[5, -5, 3]} intensity={0.5} color="#f472b6" />
      
      <AnimatedSphere position={[-1.5, 0.8, 0]} color="#6366f1" speed={1} />
      <AnimatedSphere position={[1.2, -0.5, 0.5]} color="#8b5cf6" speed={0.8} />
      <AnimatedTorus position={[0, 1.2, -0.8]} color="#06b6d4" speed={1.2} />
      <AnimatedBox position={[-1, -1, 0.5]} color="#f59e0b" speed={0.9} />
      <AnimatedIcosahedron position={[1.5, 0.5, -0.3]} color="#ec4899" speed={1.1} />
      <AnimatedBox position={[0, -1.2, 0.8]} color="#10b981" speed={1.3} />
    </group>
  );
}

export default function Hero3D() {
  return (
    <Canvas
      className="w-full h-full"
      style={{ backgroundColor: 'transparent' }}
      camera={{ position: [0, 0, 6], fov: 50 }}
      dpr={[1, 2]}
    >
      <color attach="background" args={['rgba(0,0,0,0)']} />
      <MainGroup />
      <ParticleField />
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        autoRotate 
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 3}
      />
    </Canvas>
  );
}
