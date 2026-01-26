import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Float, PerspectiveCamera } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

// --- Assets & Config ---
const THEME = {
    primary: '#002B7A',
    point: '#FF5A36',
    bg: '#F5F7FA'
};

// --- Three.js Components ---

const PulsingCore = ({ status }) => {
    const meshRef = useRef();
    
    // Derived values for Material Props
    let distortion = 0.5;
    let speed = 2.0;
    
    // Base scale target for animation
    let targetBaseScale = 1.6; // Slightly larger for left side impact

    if (status === 'success') {
        targetBaseScale = 1.8;
        distortion = 0.3; 
        speed = 1.0;
    } else if (status === 'error') {
        targetBaseScale = 1.2;
        distortion = 0.8; 
        speed = 4.0;
    }

    // Color Logic: Success keeps the same primary color, only texture changes
    const color = status === 'error' ? '#EF4444' : THEME.primary;

    useFrame(({ clock, mouse }) => {
        const t = clock.getElapsedTime();
        
        // Dynamic Scale Animation
        const pulse = status === 'loading' ? Math.sin(t * 3) * 0.05 : 0;
        const scale = targetBaseScale + pulse;

        if (meshRef.current) {
            meshRef.current.scale.set(scale, scale, scale);
            
            // Interaction: Subtle tilt towards mouse
            const targetX = mouse.x * 0.3;
            const targetY = mouse.y * 0.3;
            
            meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetY + t * 0.2, 0.1);
            meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetX + t * 0.3, 0.1);
        }
    });

    return (
        <Sphere args={[1, 64, 64]} ref={meshRef}>
            <MeshDistortMaterial
                color={color}
                envMapIntensity={0.8} 
                clearcoat={0.9} // Very glossy
                clearcoatRoughness={0.1} 
                metalness={0.4}
                roughness={0.1}
                distort={distortion} 
                speed={speed}
            />
        </Sphere>
    );
};

const OrbitingParticle = ({ radius, speed, size, color, offset }) => {
    const ref = useRef();
    
    useFrame(({ clock }) => {
        const t = clock.getElapsedTime() * speed + offset;
        // Orbit logic
        ref.current.position.x = Math.cos(t) * radius;
        ref.current.position.z = Math.sin(t) * radius;
        ref.current.position.y = Math.sin(t * 1.5) * 1.0; // Dynamic height
    });

    return (
        <mesh ref={ref}>
            <sphereGeometry args={[size, 16, 16]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} toneMapped={false} />
        </mesh>
    );
};

const Scene = ({ status }) => {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={45} />
            <ambientLight intensity={1.2} />
            <pointLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
            <pointLight position={[-10, 5, 5]} intensity={1.5} color={THEME.point} />
            
            {/* LEFT SIDE GROUP: Move everything to the left */}
            <group position={[-3.5, 0, 0]}> 
                <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
                    <PulsingCore status={status} />
                </Float>

                {status !== 'error' && (
                    <>
                        {/* Particles orbiting the core on the left */}
                        <OrbitingParticle radius={3.2} speed={0.7} offset={0} size={0.09} color="#FF5A36" />
                        <OrbitingParticle radius={4.0} speed={0.4} offset={2} size={0.07} color="#00C896" />
                        <OrbitingParticle radius={3.0} speed={1.0} offset={4} size={0.06} color="#8AB4F8" />
                        <OrbitingParticle radius={4.5} speed={0.3} offset={5} size={0.10} color="#9D4EDD" />
                    </>
                )}
            </group>
        </>
    );
};

// --- Main Component ---

const SignupLoadingScreen = ({ progress, message, status, onComplete, onRetry }) => {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-50 overflow-hidden"
            style={{ 
                background: 'linear-gradient(110deg, #F5F7FA 0%, #E0E7F1 100%)',
            }} 
        >
            {/* 3D Scene Layer (Fullscreen Canvas, but objects shifted left) */}
            <div className="absolute inset-0 z-0">
                <Canvas>
                    <Scene status={status} />
                </Canvas>
            </div>

            {/* UI Overlay Layer - RIGHT HALF */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 flex flex-col justify-center items-center z-10 px-12">
                <motion.div
                    key={status} 
                    initial={{ x: 20, opacity: 0 }} // Slide in from right
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-start w-full max-w-lg" // Left align text in the right column
                >
                    {/* Status Text Block */}
                    <div className="mb-14 relative w-full">
                         {/* Text Glow Background */}
                        <div className="absolute -left-10 top-1/2 -translate-y-1/2 bg-white/60 blur-3xl rounded-full w-[120%] h-[150%] -z-10" />
                        
                        <h2 
                            style={{ 
                                fontFamily: "'Pretendard Variable', sans-serif",
                                fontSize: '36px', // Larger Title
                                fontWeight: '800',
                                color: '#1B2430',
                                marginBottom: '16px',
                                lineHeight: '1.2',
                                letterSpacing: '-0.8px'
                            }}
                        >
                             {status === 'loading' ? (
                                <>
                                    사장님의 데이터를<br/>
                                    <span style={{ color: THEME.primary }}>불러오고 있습니다</span>
                                </>
                             ) : (status === 'success' ? (
                                <>
                                    모든 준비가<br/>
                                    <span style={{ color: THEME.primary }}>완료되었습니다!</span>
                                </>
                             ) : "오류가 발생했습니다")}
                        </h2>
                        
                        <p
                            style={{
                                fontFamily: "'Pretendard Variable', sans-serif",
                                fontSize: '17px',
                                fontWeight: '500',
                                color: status === 'error' ? '#EF4444' : '#555F70',
                                lineHeight: '1.6'
                            }}
                        >
                            {status === 'loading' ? (
                                <>
                                    {message}<br/>
                                    잠시만 기다려주세요 ({Math.round(progress)}%)
                                </>
                            ) : (status === 'success' ? (
                                "사장님만의 특별한 공간으로 안내해드릴게요."
                             ) : "네트워크 연결을 확인하고 다시 시도해주세요.")}
                        </p>
                    </div>

                    {/* Interactive Elements */}
                    <div className="pointer-events-auto w-full">
                        {status === 'loading' && (
                             <div 
                                style={{
                                    width: '100%',
                                    height: '8px',
                                    background: 'rgba(255, 255, 255, 0.8)',
                                    borderRadius: '10px',
                                    overflow: 'hidden',
                                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                                }}
                            >
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(progress, 100)}%` }}
                                    transition={{ ease: "linear", duration: 0.3 }}
                                    style={{
                                        height: '100%',
                                        background: 'linear-gradient(90deg, #002B7A 0%, #2563EB 100%)',
                                        borderRadius: '10px',
                                    }}
                                />
                            </div>
                        )}

                        {status === 'success' && (
                            <motion.button
                                initial={{ scale: 0.9, opacity: 0, x: -10 }}
                                animate={{ scale: 1, opacity: 1, x: 0 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onComplete}
                                className="relative overflow-hidden group w-full"
                                style={{
                                    background: 'linear-gradient(135deg, #002B7A 0%, #0042A0 100%)',
                                    color: 'white',
                                    padding: '20px 32px',
                                    borderRadius: '16px',
                                    fontSize: '18px',
                                    fontWeight: '700',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    cursor: 'pointer',
                                    boxShadow: '0 12px 30px rgba(0, 43, 122, 0.25)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px'
                                }}
                            >
                                {/* Subtle Shine */}
                                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shine_1.2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-10" />
                                <span className="relative z-20">PULSE 시작하기</span>
                                <span className="relative z-20 text-xl">→</span>
                            </motion.button>
                        )}

                         {status === 'error' && (
                            <motion.button
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                whileHover={{ scale: 1.02 }}
                                onClick={onRetry}
                                className="w-full"
                                style={{
                                    background: '#EF4444',
                                    color: 'white',
                                    padding: '18px 32px',
                                    borderRadius: '16px',
                                    fontSize: '18px',
                                    fontWeight: '700',
                                    border: 'none',
                                    cursor: 'pointer',
                                    boxShadow: '0 8px 20px rgba(239, 68, 68, 0.2)'
                                }}
                            >
                                다시 시도하기
                            </motion.button>
                        )}
                    </div>
                </motion.div>
            </div>
            
            <style>{`
                @keyframes shine {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </motion.div>
    );
};

export default SignupLoadingScreen;

