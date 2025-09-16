import React from 'react';
import { FacebookIcon, TikTokIcon, TelegramIcon } from './icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 mt-auto">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-center items-center space-x-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
            <FacebookIcon className="w-6 h-6" />
          </a>
          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
            <TikTokIcon className="w-6 h-6" />
          </a>
          <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
            <TelegramIcon className="w-6 h-6" />
          </a>
        </div>
        <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-4">
          © {new Date().getFullYear()} Caption Generator AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
