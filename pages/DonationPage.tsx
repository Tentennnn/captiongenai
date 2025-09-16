import React, { useEffect, useState } from 'react';
import ParticleBackground from '../components/ParticleBackground';

interface DonationPageProps {
  onBack: () => void;
}

const DonationPage: React.FC<DonationPageProps> = ({ onBack }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 via-white to-blue-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      <ParticleBackground />
      
      {/* Back button - Positioned at top left */}
      <button
        onClick={onBack}
        className="absolute top-4 left-4 z-20 flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white/80 dark:bg-gray-800/80 rounded-lg backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 transition-colors duration-200"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        ត្រឡប់ទៅទំព័រដើម
      </button>
      
      <div className={`transform transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} relative z-10`}>
        <h1 className="text-4xl font-bold mb-8 text-center relative">
          <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            គាំទ្រគម្រោង
          </span>
          <span className="text-transparent">គាំទ្រគម្រោង</span>
        </h1>

        <div className="relative group/card">
          {/* Simple gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-purple-400/5 to-pink-400/10 rounded-3xl" />
          
          {/* Main card container */}
          <div 
            className={`
              relative max-w-md w-full rounded-3xl p-8
              bg-white/40 dark:bg-gray-800/40
              backdrop-blur-xl backdrop-saturate-150
              border border-white/20 dark:border-white/10
              shadow-sm
              transform transition-all duration-500
              group-hover/card:backdrop-blur-xl
            `}
          >
            <h2 className="text-2xl font-semibold mb-8 text-center text-gray-800 dark:text-white animate-bounce-slow">
              ស្កេន QR Code ដើម្បីគាំទ្រ
            </h2>

            <a 
              href="https://pay.ababank.com/oRF8/iuvuqr7m"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="flex justify-center mb-6">
                <div className="p-3 bg-white rounded-2xl">
                  <img 
                    src="/assets/qr-code.svg" 
                    alt="ABA Bank QR Code" 
                    className="w-64 h-64 rounded-xl"
                  />
                </div>
              </div>

              <p className="text-center text-lg font-medium text-blue-600 dark:text-blue-400">
                GO TO ABA MOBILE
              </p>
            </a>

            <p className="text-center text-gray-600 dark:text-gray-300 mt-8 animate-fade-in leading-relaxed">
              សូមអរគុណសម្រាប់ការគាំទ្រគម្រោងនេះ!<br/>
              ការបរិច្ចាគរបស់អ្នកជួយឱ្យសេវាកម្មនេះដំណើរការបាន។
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationPage;