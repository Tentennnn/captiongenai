import React from 'react';
import { Platform } from '../types';
import { FacebookIcon, TikTokIcon, YouTubeIcon } from './icons';

interface PlatformSelectorProps {
  selectedPlatform: Platform;
  onSelect: (platform: Platform) => void;
}

const platformOptions = [
  { id: Platform.Facebook, Icon: FacebookIcon, name: 'Facebook' },
  { id: Platform.TikTok, Icon: TikTokIcon, name: 'TikTok' },
  { id: Platform.YouTube, Icon: YouTubeIcon, name: 'YouTube' },
];

const PlatformSelector: React.FC<PlatformSelectorProps> = ({ selectedPlatform, onSelect }) => {
  return (
    <div className="flex space-x-2 sm:space-x-3">
      {platformOptions.map(({ id, Icon, name }) => {
        const isSelected = selectedPlatform === id;
        return (
          <button
            key={id}
            onClick={() => onSelect(id)}
            aria-pressed={isSelected}
            aria-label={`Select ${name} platform`}
            className={`flex-1 flex items-center justify-center gap-2 sm:gap-3 px-3 py-2.5 rounded-lg border-2 transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500/70 focus:ring-offset-slate-900 ${
              isSelected
                ? 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:border-blue-500 hover:bg-slate-700 hover:-translate-y-0.5'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium text-sm sm:text-base">{name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default PlatformSelector;