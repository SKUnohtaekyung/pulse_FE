import React from 'react';
import { Bell } from 'lucide-react';
import { COLORS } from '../../constants';

const Header = ({ title }) => (
    <header className="flex justify-between items-center mb-3 pl-2 shrink-0">
        <div>
            <h1 style={{ color: COLORS.primary }} className="text-[26px] font-bold leading-tight mb-0.5">
                범계 로데오점 박사장님, 안녕하세요!
            </h1>
            <p style={{ color: COLORS.primaryText }} className="text-[15px] opacity-70">
                {title}
            </p>
        </div>

        <button className="relative p-2.5 rounded-xl bg-white shadow-sm hover:bg-gray-50 transition-colors">
            <Bell size={22} color={COLORS.primary} />
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.point }}></span>
        </button>
    </header>
);

export default Header;
