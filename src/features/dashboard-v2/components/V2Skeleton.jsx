import React from 'react';
import { motion } from 'framer-motion';

const SkeletonPulse = ({ className }) => (
    <div className={`bg-gray-200 animate-pulse rounded-md ${className}`}></div>
);

const V2Skeleton = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col md:flex-row gap-6 p-6 pb-20 md:pb-6 relative h-full bg-[#f8fafc]"
        >
            {/* Left Pane: Facts (Flex 1.4) */}
            <div className="flex-[1.4] flex flex-col gap-6 max-w-full md:max-w-none overflow-hidden h-full">
                {/* [P0] Core Vitals Skeleton */}
                <div className="flex gap-4 mb-2">
                    <SkeletonPulse className="flex-1 h-[80px] rounded-xl" />
                    <SkeletonPulse className="flex-1 h-[80px] rounded-xl" />
                    <SkeletonPulse className="flex-1 h-[80px] rounded-xl" />
                </div>

                {/* [P2] External Insights Skeleton */}
                <div className="flex gap-8 shrink-0">
                    <div className="flex-1 py-1">
                        <SkeletonPulse className="w-1/3 h-5 mb-4" />
                        <SkeletonPulse className="w-full h-8 mb-2 rounded-lg" />
                        <SkeletonPulse className="w-full h-8 mb-2 rounded-lg" />
                    </div>
                    <div className="w-px bg-gray-200"></div>
                    <div className="flex-[0.8] flex flex-col gap-4 py-1">
                        <SkeletonPulse className="w-full h-[80px] rounded-[16px]" />
                        <div className="w-full h-px bg-gray-100"></div>
                        <div className="flex gap-2">
                            <SkeletonPulse className="w-16 h-6 rounded-full" />
                            <SkeletonPulse className="w-20 h-6 rounded-full" />
                        </div>
                    </div>
                </div>

                {/* [P3] Deep Dive Skeleton */}
                <div className="flex-1 flex flex-col min-h-0 bg-white rounded-2xl border border-gray-100 p-6">
                    <SkeletonPulse className="w-1/4 h-6 mb-6" />
                    <SkeletonPulse className="w-full flex-1 rounded-xl" />
                </div>
            </div>

            {/* Right Pane: Actions Skeleton */}
            <div className="flex-1 md:flex-none md:w-[480px] flex flex-col bg-white shrink-0 h-full rounded-t-[24px] md:rounded-[24px] border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] p-6 md:p-8 relative">
                <div className="flex flex-col gap-4">
                    {/* Today Brief Skeleton */}
                    <div className="py-2">
                        <SkeletonPulse className="w-1/4 h-5 mb-3" />
                        <SkeletonPulse className="w-full h-8 mb-2" />
                        <SkeletonPulse className="w-2/3 h-8" />
                    </div>

                    <div className="w-full h-px bg-gray-100 my-2"></div>

                    {/* AI Suggestion Content Skeleton */}
                    <SkeletonPulse className="w-full h-[140px] rounded-[20px]" />

                    {/* Action Cards Skeleton */}
                    <div className="flex flex-col gap-3 mt-4">
                        <SkeletonPulse className="w-1/3 h-5 mb-1" />
                        <SkeletonPulse className="w-full h-[80px] rounded-xl" />
                        <SkeletonPulse className="w-full h-[80px] rounded-xl" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default V2Skeleton;
