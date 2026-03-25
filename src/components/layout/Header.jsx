import React from 'react';
import { Bell } from 'lucide-react';
import InlineChatInterface from '../../features/insight/InlineChatInterface';
import { COLORS } from '../../constants';

const OWNER_FALLBACK = '\uC0AC\uC7A5\uB2D8';
const GREETING_SUFFIX = '\uC548\uB155\uD558\uC138\uC694!';

const Header = ({ title, profile }) => {
    const ownerName = profile?.ownerName
        ? `${profile.ownerName}\uB2D8`
        : OWNER_FALLBACK;
    const greeting = profile?.shopName
        ? `${profile.shopName} ${ownerName}, ${GREETING_SUFFIX}`
        : `${ownerName}, ${GREETING_SUFFIX}`;

    return (
        <header className="flex justify-between items-center mb-3 pl-2 shrink-0">
            <div>
                <h1 style={{ color: COLORS.primary }} className="text-[26px] font-bold leading-tight mb-0.5">
                    {greeting}
                </h1>
                <p style={{ color: COLORS.primaryText }} className="text-[15px] opacity-70">
                    {title}
                </p>
            </div>

            <div className="flex items-center gap-2">
                <InlineChatInterface />
                <button className="relative p-2.5 rounded-xl bg-white shadow-sm hover:bg-gray-50 transition-colors">
                    <Bell size={22} color={COLORS.primary} />
                    <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.point }}></span>
                </button>
            </div>
        </header>
    );
};

export default Header;
