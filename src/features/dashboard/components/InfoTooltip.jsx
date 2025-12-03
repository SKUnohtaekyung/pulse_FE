import React from 'react';
import { HelpCircle } from 'lucide-react';

const InfoTooltip = ({ text, size = 16, align = 'center', direction = 'top' }) => {
    const positionClasses = {
        center: "left-1/2 -translate-x-1/2",
        left: "left-0",
        right: "right-0"
    };

    const verticalClasses = {
        top: "bottom-full mb-2",
        bottom: "top-full mt-2"
    };

    const arrowPositionClasses = {
        center: "left-1/2 -translate-x-1/2",
        left: "left-4",
        right: "right-4"
    };

    const arrowDirectionClasses = {
        top: "top-full border-t-[#191F28] border-b-transparent border-t-[5px]",
        bottom: "bottom-full border-b-[#191F28] border-t-transparent border-b-[5px]"
    };

    return (
        <div className="group/tooltip relative inline-flex items-center ml-1.5 z-40">
            <HelpCircle size={size} className="text-gray-400 cursor-help hover:text-[#002B7A] transition-colors" />
            <div className={`absolute w-48 bg-[#191F28] text-white text-xs p-2.5 rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-all duration-200 pointer-events-none shadow-xl z-[60] ${positionClasses[align]} ${verticalClasses[direction]}`}>
                {text}
                <div className={`absolute w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent ${arrowPositionClasses[align]} ${arrowDirectionClasses[direction]}`}></div>
            </div>
        </div>
    );
};

export default InfoTooltip;
