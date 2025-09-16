import React from 'react';
import { Platform } from '../types';
import { FacebookIcon } from './icons';

interface PlatformSelectorProps {
  selectedPlatform: Platform;
  onSelect: (platform: Platform) => void;
}

const platformOptions = [
  { id: Platform.Facebook, Icon: FacebookIcon, name: 'Facebook' },
];

const PlatformSelector: React.FC<PlatformSelectorProps> = ({ selectedPlatform, onSelect }) => {
  return (
    <div className="flex justify-center">
      <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-lg border-2 border-blue-500 shadow-lg shadow-blue-500/20">
        <FacebookIcon className="w-5 h-5" />
        <span className="font-medium text-sm sm:text-base">Facebook</span>
      </div>
    </div>
  );
};

export default PlatformSelector;