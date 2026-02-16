import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Icosahedron, Float, Environment } from '@react-three/drei';

function GeometricHeart() {
    const meshRef = useRef();
    const wireframeRef = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        const beat = Math.sin(t * 3) * 0.1 + Math.sin(t * 3 + Math.PI * 0.1) * 0.05;
        const scale = 1.0 + Math.max(0, beat); // Scale reduced to 1.0 as requested

        meshRef.current.scale.set(scale, scale, scale);
        wireframeRef.current.scale.set(scale * 1.2, scale * 1.2, scale * 1.2);

        meshRef.current.rotation.x = t * 0.2;
        meshRef.current.rotation.y = t * 0.3;
        wireframeRef.current.rotation.x = -t * 0.1;
        wireframeRef.current.rotation.y = -t * 0.1;
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <group position={[0, 0, 0]}>
                <Icosahedron ref={meshRef} args={[1, 0]}>
                    <meshPhysicalMaterial
                        color="#002B7A"
                        roughness={0.1}
                        metalness={0.8}
                        clearcoat={1}
                        clearcoatRoughness={0.1}
                        emissive="#001f57"
                        emissiveIntensity={0.2}
                    />
                </Icosahedron>
                <Icosahedron ref={wireframeRef} args={[1, 0]}>
                    <meshBasicMaterial color="#4D85FF" wireframe transparent opacity={0.3} />
                </Icosahedron>
            </group>
        </Float>
    );
}

const ThreeBackground = ({ position = [0, 0, 0], scale = 1 }) => {
    return (
        <div className="w-full h-full absolute inset-0 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }} gl={{ alpha: true, antialias: true }}>
                <ambientLight intensity={0.8} />
                <pointLight position={[10, 10, 10]} intensity={1.5} color="#4D85FF" />
                <pointLight position={[-10, -10, -5]} intensity={1} color="#002B7A" />

                <group position={position} scale={scale}>
                    <GeometricHeart />
                </group>

                <Environment preset="city" />
            </Canvas>
        </div>
    );
};

export default ThreeBackground;
