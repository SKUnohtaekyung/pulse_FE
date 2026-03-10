import React from 'react';

const V2PersonaSummary = ({ personas = [] }) => {
    if (!personas || personas.length === 0) return null;

    return (
        <div className="flex flex-col gap-3 py-1">
            <h3 className="text-[14px] font-bold text-[#002B7A] tracking-wide mb-1 flex items-center gap-1">
                이런 손님들이 많이 찾았어요
            </h3>

            <div className="flex flex-col gap-2.5">
                {personas.map((persona, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-blue-50/50 hover:bg-blue-50 border border-blue-100/50 rounded-2xl group cursor-pointer transition-colors shadow-sm"
                    >
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-blue-100/30 text-xl group-hover:scale-110 transition-transform">
                            {persona.emoji}
                        </div>
                        <div className="flex flex-col justify-center min-w-0 flex-1">
                            <h4 className="text-[14px] font-bold text-[#002B7A] mb-0.5">
                                {persona.label}
                            </h4>
                            <p className="text-[12px] text-[#002B7A]/75 truncate font-medium">
                                {persona.detail}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default V2PersonaSummary;
