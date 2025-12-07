import React from 'react';
import { COLORS } from '../../constants';

const Footer = () => {
    return (
        <footer className="py-12 px-6 bg-gray-50 border-t border-gray-200">
            <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
                <div>
                    <img src={`${import.meta.env.BASE_URL}PULSE_LOGO.png`} alt="PULSE" className="h-6 w-auto mb-4 opacity-50 grayscale" />
                    <p className="text-sm text-gray-500 leading-relaxed">
                        외식업 사장님을 위한 통합 마케팅 자동화 플랫폼<br />
                        Copyright © 2025 PULSE. All rights reserved.
                    </p>
                </div>
                <div className="flex gap-8 text-sm text-gray-500">
                    <a href="#" className="hover:text-gray-800">서비스 이용약관</a>
                    <a href="#" className="hover:text-gray-800">개인정보처리방침</a>
                    <a href="#" className="hover:text-gray-800">고객센터</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
