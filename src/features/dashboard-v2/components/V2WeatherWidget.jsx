import React from 'react';
import { motion } from 'framer-motion';
import WeatherAnimation from '../../dashboard/components/WeatherAnimation';
import { WEATHER_TYPES } from '../../dashboard/weatherData';

const V2WeatherWidget = ({ weatherType = 'clear_day' }) => {
    // Graceful fallback if weatherType is invalid
    const currentWeather = WEATHER_TYPES[weatherType] || WEATHER_TYPES['clear_day'];
    const WeatherIcon = currentWeather.icon;

    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={`relative overflow-hidden rounded-[16px] bg-gradient-to-br ${currentWeather.gradient} p-4 text-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-white/20 backdrop-blur-md flex items-center justify-between min-h-[80px] cursor-pointer`}
        >
            {/* Background Animation Layer */}
            <div className="absolute inset-0 z-0 opacity-70 mix-blend-overlay">
                <WeatherAnimation animation={currentWeather.animation} />
            </div>

            {/* Content Layer */}
            <div className="relative z-10 flex flex-col justify-center">
                <h3 className="text-[12px] font-bold opacity-90 mb-0.5 tracking-wide drop-shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse"></span>
                    오늘 상권 날씨
                </h3>
                <div className="flex items-baseline gap-2">
                    <p className="text-[18px] font-bold leading-none drop-shadow-md">{currentWeather.label}</p>
                    <span className="text-[11px] font-medium opacity-100 px-2 py-0.5 bg-white/20 border border-white/30 backdrop-blur-sm shadow-inner rounded-full drop-shadow-sm">
                        {currentWeather.detail || "유동인구 보통"}
                    </span>
                </div>
            </div>

            {/* Icon Layer */}
            <div className="relative z-10 pl-4">
                <WeatherIcon size={36} className="text-white drop-shadow-md" strokeWidth={1.5} />
            </div>
        </motion.div>
    );
};

export default V2WeatherWidget;
