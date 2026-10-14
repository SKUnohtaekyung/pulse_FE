import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Icosahedron, Float, Environment, Lightformer } from '@react-three/drei';
import ErrorBoundary from '../../components/common/ErrorBoundary';
import { DEMO_MODE } from '../../config/env';

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
            <ErrorBoundary fallback={<div aria-hidden="true" className="w-full h-full" />} name="ThreeBackground">
                <Canvas camera={{ position: [0, 0, 6], fov: 45 }} gl={{ alpha: true, antialias: true }}>
                    <ambientLight intensity={0.8} />
                    <pointLight position={[10, 10, 10]} intensity={1.5} color="#4D85FF" />
                    <pointLight position={[-10, -10, -5]} intensity={1} color="#002B7A" />

                    <group position={position} scale={scale}>
                        <GeometricHeart />
                    </group>

                    {DEMO_MODE ? (
                        // 전시 데모: 외부 HDR 파일(raw.githack) 다운로드 없이 반사광을 장면 안에서 만든다.
                        // 전시장 네트워크가 불안정해도 3D 하트가 사라지지 않는다.
                        <Environment resolution={256}>
                            <color attach="background" args={['#1E2F55']} />
                            <Lightformer form="rect" intensity={2.5} color="#DCE6FF" position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[20, 20, 1]} />
                            <Lightformer form="rect" intensity={2} position={[0, 5, -9]} scale={[10, 10, 1]} />
                            <Lightformer form="rect" intensity={1.5} position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[20, 2, 1]} />
                            <Lightformer form="rect" intensity={1.5} position={[5, 1, -1]} rotation-y={-Math.PI / 2} scale={[20, 2, 1]} />
                            <Lightformer form="ring" intensity={2} color="#4D85FF" position={[-3, 4, 4]} scale={3} />
                        </Environment>
                    ) : (
                        <Environment preset="city" />
                    )}
                </Canvas>
            </ErrorBoundary>
        </div>
    );
};

export default ThreeBackground;
