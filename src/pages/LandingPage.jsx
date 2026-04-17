import React, { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Header from '../components/landing/Header';
import HeroSection from '../components/landing/HeroSection';
import ProblemSection from '../components/landing/ProblemSection';
import SolutionSection from '../components/landing/SolutionSection';
import FeatureSection from '../components/landing/FeatureSection';
import SocialProofSection from '../components/landing/SocialProofSection';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/landing/Footer';
import { COLORS } from '../constants';

import HowItWorksSection from '../components/landing/HowItWorksSection';
import FAQSection from '../components/landing/FAQSection';

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
    useEffect(() => {
        // [CSS 오버라이드]: globals.css의 html, body { h-full overflow-hidden } 설정 강제 해제
        const originalHtmlHeight = document.documentElement.style.height;
        const originalHtmlOverflow = document.documentElement.style.overflow;
        const originalBodyHeight = document.body.style.height;
        const originalBodyOverflow = document.body.style.overflow;

        document.documentElement.style.height = 'auto';
        document.documentElement.style.overflow = 'auto';
        document.body.style.height = 'auto';
        document.body.style.overflow = 'auto';

        // Initialize Lenis for smooth scroll (GSAP ScrollTrigger synced)
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
        });

        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        return () => {
            lenis.destroy();
            gsap.ticker.remove(lenis.raf);

            // [클린업]: CSS 상태 원복
            document.documentElement.style.height = originalHtmlHeight;
            document.documentElement.style.overflow = originalHtmlOverflow;
            document.body.style.height = originalBodyHeight;
            document.body.style.overflow = originalBodyOverflow;
        };
    }, []);

    return (
        <div className="font-pretendard" style={{ backgroundColor: COLORS.bgPage }}>
            <Header />
            <main>
                <HeroSection />
                <ProblemSection />
                <FeatureSection />
                <HowItWorksSection />
                <SocialProofSection />
                <FAQSection />
                <CTASection />
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;
