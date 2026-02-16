import React from 'react';
import { motion } from 'framer-motion';

const WeatherAnimation = ({ animation }) => {
    return (
        <div className="absolute inset-0 opacity-30 pointer-events-none overflow-hidden">
            {/* Rain / Drizzle / Sleet */}
            {(animation === 'rain' || animation === 'rain_heavy' || animation === 'drizzle' || animation === 'sleet') && (
                [...Array(animation === 'rain_heavy' ? 20 : 10)].map((_, i) => (
                    <motion.div
                        key={`rain-${i}`}
                        className="absolute top-[-20px] bg-white/40 w-[1px] h-[20px] rounded-full"
                        style={{ left: `${Math.random() * 100}%` }}
                        animate={{ top: ['0%', '100%'] }}
                        transition={{ duration: 0.8 + Math.random(), repeat: Infinity, ease: "linear", delay: Math.random() }}
                    />
                ))
            )}

            {/* Snow / Sleet */}
            {(animation === 'snow' || animation === 'sleet') && (
                [...Array(15)].map((_, i) => (
                    <motion.div
                        key={`snow-${i}`}
                        className="absolute top-[-10px] bg-white/60 w-1 h-1 rounded-full"
                        style={{ left: `${Math.random() * 100}%` }}
                        animate={{ top: ['0%', '100%'], x: [-10, 10] }}
                        transition={{ duration: 2 + Math.random(), repeat: Infinity, ease: "linear", delay: Math.random() }}
                    />
                ))
            )}

            {/* Stars */}
            {(animation === 'stars') && (
                [...Array(20)].map((_, i) => (
                    <motion.div
                        key={`star-${i}`}
                        className="absolute bg-white rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: Math.random() * 2 + 1,
                            height: Math.random() * 2 + 1
                        }}
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 1.5 + Math.random(), repeat: Infinity, ease: "easeInOut", delay: Math.random() }}
                    />
                ))
            )}

            {/* Clouds / Fog */}
            {(animation === 'clouds' || animation === 'clouds_heavy' || animation === 'fog') && (
                [...Array(5)].map((_, i) => (
                    <motion.div
                        key={`cloud-${i}`}
                        className={`absolute bg-white/${animation === 'fog' ? '10' : '20'} rounded-full blur-xl`}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 50}%`,
                            width: Math.random() * 100 + 50,
                            height: Math.random() * 60 + 30
                        }}
                        animate={{ x: [-50, 50] }}
                        transition={{ duration: 10 + Math.random() * 10, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                    />
                ))
            )}

            {/* Thunder */}
            {animation === 'thunder' && (
                <motion.div
                    className="absolute inset-0 bg-white/30"
                    animate={{ opacity: [0, 0.5, 0, 0, 0.3, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", times: [0, 0.05, 0.1, 0.8, 0.85, 1] }}
                />
            )}

            {/* Sun */}
            {animation === 'sun' && (
                <motion.div
                    className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
            )}
        </div>
    );
};

export default WeatherAnimation;
