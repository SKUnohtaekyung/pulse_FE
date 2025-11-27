import React from 'react';
import { COLORS } from '../../constants';

const InsightCard = ({ title, icon: Icon, tags, highlight, type }) => {
    const isNegative = type === 'negative';

    return (
        <div
            className="flex-1 rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 flex flex-col min-h-0"
            style={{ backgroundColor: COLORS.bgCard, boxShadow: `0 4px 12px ${COLORS.shadow}` }}
        >
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${isNegative ? 'bg-red-50' : 'bg-blue-50'}`}>
                        <Icon size={18} color={isNegative ? '#EF4444' : COLORS.primary} />
                    </div>
                    <h3 className="text-[16px] font-bold" style={{ color: COLORS.primaryText }}>{title}</h3>
                </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-2">
                {tags.map((tag, i) => (
                    <span
                        key={i}
                        className="px-2 py-0.5 rounded-md text-[12px] font-medium"
                        style={{
                            backgroundColor: isNegative ? '#FEF2F2' : COLORS.bgPage,
                            color: isNegative ? '#EF4444' : COLORS.secondaryText
                        }}
                    >
                        #{tag}
                    </span>
                ))}
            </div>

            <div className="pt-2 border-t border-gray-100 mt-auto">
                <p className="text-[13px] leading-snug">
                    <span className="font-bold" style={{ color: isNegative ? '#EF4444' : COLORS.primary }}>
                        {highlight}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default InsightCard;
