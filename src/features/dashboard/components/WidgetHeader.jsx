import React from 'react';
import InfoTooltip from './InfoTooltip';

const WidgetHeader = ({ icon: Icon, title, tooltipText, iconSize = 20, tooltipSize = 16, rightElement }) => (
    <div className="flex justify-between items-center z-10 shrink-0">
        <h3 className="font-bold text-gray-500 text-base flex items-center gap-2">
            <Icon size={iconSize} className="text-[#002B7A]" /> {title}
            <InfoTooltip text={tooltipText} size={tooltipSize} />
        </h3>
        {rightElement}
    </div>
);

export default WidgetHeader;
