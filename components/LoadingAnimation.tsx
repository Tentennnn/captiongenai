import React, { useState, useEffect } from 'react';

const messages = [
  'កំពុងបង្កើតចំណងជើងដ៏ល្អឥតខ្ចោះ...',
  'កំពុងវិភាគសំណើរបស់អ្នក...',
  'កំពុងច្នៃពាក្យពេចន៍ដ៏ទាក់ទាញ...',
  'ជិតរួចរាល់ហើយ...',
];

const LoadingAnimation: React.FC = () => {
  const [message, setMessage] = useState(messages[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessage(prevMessage => {
        const currentIndex = messages.indexOf(prevMessage);
        const nextIndex = (currentIndex + 1) % messages.length;
        return messages[nextIndex];
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center text-slate-400 animate-fade-in-up">
      <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: '0s' }}></div>
          <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
      <p className="mt-6 font-medium text-lg text-slate-300">{message}</p>
      <p className="text-sm text-slate-500">
        សូមមេត្តារង់ចាំបន្តិច
      </p>
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(0.9);
          }
        }
        .animate-pulse {
          animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingAnimation;