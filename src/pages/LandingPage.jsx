import React from 'react';
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

const LandingPage = () => {
    return (
        <div className="h-screen overflow-y-auto font-pretendard scroll-smooth" style={{ backgroundColor: COLORS.bgPage }}>
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
