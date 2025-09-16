import React, { useState } from 'react';
import type { GenerationResult } from '../types';
import { CopyIcon, RegenerateIcon, CheckIcon } from './icons';

interface ResultCardProps {
  result: GenerationResult;
  onRegenerate: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, onRegenerate }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = `${result.caption}\n\n${result.hashtags.join(' ')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex flex-col h-full animate-fade-in-up">
        <div className="flex-grow p-5 bg-slate-800/50 rounded-lg space-y-4 whitespace-pre-wrap text-slate-200 overflow-y-auto h-96 shadow-inner">
            <p className="leading-relaxed">{result.caption}</p>
            {result.hashtags && result.hashtags.length > 0 && (
                <p className="text-blue-400 font-medium pt-2">{result.hashtags.join(' ')}</p>
            )}
        </div>
        <div className="flex items-center gap-3 mt-4">
            <button
                onClick={handleCopy}
                className={`flex-1 flex items-center justify-center gap-2 font-medium py-2.5 px-4 rounded-lg transition-all duration-300 ${copied ? 'bg-green-600 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            >
                {copied ? <CheckIcon className="w-5 h-5" /> : <CopyIcon className="w-5 h-5" />}
                <span>{copied ? 'បានចម្លង!' : 'ចម្លង'}</span>
            </button>
            <button
                onClick={onRegenerate}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-700 text-slate-200 font-medium py-2.5 px-4 rounded-lg hover:bg-slate-600 transition-colors"
            >
                <RegenerateIcon className="w-5 h-5" />
                <span>បង្កើតឡើងវិញ</span>
            </button>
        </div>
    </div>
  );
};

export default ResultCard;