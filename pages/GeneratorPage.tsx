import React, { useState, useCallback } from 'react';
import { Platform, Style, Audience, Length } from '../types';
import type { FormState, GenerationResult } from '../types';
import { generateCaption } from '../services/geminiService';
import PlatformSelector from '../components/PlatformSelector';
import ResultCard from '../components/ResultCard';
import LoadingAnimation from '../components/LoadingAnimation';
import { HeaderIcon, ArrowLeftIcon, SpinnerIcon } from '../components/icons';
import { ThemeToggle } from '../components/ThemeToggle';

interface GeneratorPageProps {
  onBack: () => void;
}

const GeneratorPage: React.FC<GeneratorPageProps> = ({ onBack }) => {
  const [formState, setFormState] = useState<FormState>({
    platform: Platform.Facebook,
    productName: '',
    style: Style.Engaging,
    audience: Audience.General,
    length: Length.Medium,
    generateHashtags: true,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const examplePrompts = [
    'កាហ្វេរសជាតិថ្មី',
    'សម្លៀកបំពាក់បុរស',
    'ហាងកាហ្វេថ្មី',
    'សាប៊ូដុសខ្លួន',
    'កម្មវិធីសិក្សាអនឡាញ',
  ];

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormState((prev) => ({ ...prev, [name]: checked }));
    } else {
        setFormState((prev) => ({ ...prev, [name]: value }));
    }
  };

  const setPlatform = (platform: Platform) => {
    setFormState((prev) => ({ ...prev, platform }));
  };

  const handleExampleClick = (prompt: string) => {
    setFormState(prev => ({ ...prev, productName: prompt }));
  };
  
  const handleGenerate = useCallback(async () => {
    setError(null);
    if (!formState.productName.trim()) {
      setError('សូម​បញ្ចូល​ឈ្មោះផលិតផល ឬ​ប្រធានបទ');
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const generatedResult = await generateCaption(formState);
      setResult(generatedResult);
    } catch (err) {
      setError('មានបញ្ហាក្នុងការបង្កើតចំណងជើង។ សូម​ព្យាយាម​ម្តង​ទៀត។');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [formState]);

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-8 animate-fade-in-up">
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between relative mb-8">
        <button
          onClick={onBack}
          className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-slate-400 hover:text-blue-400 transition-colors font-medium group"
          aria-label="Go back to landing page"
        >
          <ArrowLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span className="hidden sm:inline">ត្រឡប់ក្រោយ</span>
        </button>
        <div className="flex-grow flex items-center justify-center gap-3 cursor-pointer" onClick={onBack}>
            <HeaderIcon className="w-10 h-10 text-blue-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-200 text-center">
              Caption Generator AI
            </h1>
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <ThemeToggle />
        </div>
      </header>

      <main className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 bg-slate-800/60 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-700/50">
          <h2 className="text-xl font-semibold text-slate-200 mb-5">បង្កើតចំណងជើងរបស់អ្នក</h2>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">1. ជ្រើសរើស Platform</label>
              <PlatformSelector selectedPlatform={formState.platform} onSelect={setPlatform} />
            </div>

            <div>
              <label htmlFor="productName" className="block text-sm font-medium text-slate-300 mb-2">2. បញ្ចូលឈ្មោះផលិតផល / ប្រធានបទ</label>
              <input
                type="text"
                id="productName"
                name="productName"
                value={formState.productName}
                onChange={handleFormChange}
                placeholder="ឧទាហរណ៍: កាហ្វេឆ្ងាញ់ថ្មី"
                className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/80 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-inner text-slate-100 placeholder:text-slate-500"
              />
              <div className="mt-2.5 flex flex-wrap gap-2 items-center">
                <span className="text-xs text-slate-400 font-medium">សាកល្បង:</span>
                {examplePrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleExampleClick(prompt)}
                    className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-xs hover:bg-slate-600/80 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400/80"
                    aria-label={`Use example: ${prompt}`}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="style" className="block text-sm font-medium text-slate-300 mb-2">3. ស្ទីល</label>
                <select id="style" name="style" value={formState.style} onChange={handleFormChange} className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/80 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-inner appearance-none bg-no-repeat bg-right-3" style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23cbd5e1' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5em 1.5em' }}>
                  {Object.values(Style).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="audience" className="block text-sm font-medium text-slate-300 mb-2">4. ទស្សនិកជន</label>
                <select id="audience" name="audience" value={formState.audience} onChange={handleFormChange} className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/80 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-inner appearance-none bg-no-repeat bg-right-3" style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23cbd5e1' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5em 1.5em' }}>
                  {Object.values(Audience).map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">5. ប្រវែងអត្ថបទ</label>
              <div className="flex flex-wrap gap-2">
                {Object.values(Length).map(len => (
                  <label key={len} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="length"
                      value={len}
                      checked={formState.length === len}
                      onChange={handleFormChange}
                      className="sr-only peer"
                    />
                    <span className="px-4 py-2 text-sm font-medium rounded-full border border-slate-600 bg-slate-700 text-slate-200 peer-checked:bg-blue-500 peer-checked:text-white peer-checked:border-blue-500 transition-all duration-300">{len}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label htmlFor="generateHashtags" className="flex items-center gap-2.5 text-sm font-medium text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  id="generateHashtags"
                  name="generateHashtags"
                  checked={formState.generateHashtags}
                  onChange={handleFormChange}
                  className="h-4 w-4 rounded border-slate-500 text-blue-500 focus:ring-blue-600/50 bg-slate-700"
                />
                បង្កើត Hashtags
              </label>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3.5 px-4 rounded-lg hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transform hover:-translate-y-1"
            >
              {isLoading ? (
                <>
                  <SpinnerIcon className="w-5 h-5 animate-spin" />
                  <span>កំពុងបង្កើត...</span>
                </>
              ) : (
                'បង្កើត Caption'
              )}
            </button>
          </div>
        </div>

        <div className="p-6 bg-slate-800/60 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-700/50 min-h-[500px] flex flex-col justify-center">
          {isLoading && <LoadingAnimation />}
          {error && <p className="text-center text-red-500 font-medium animate-fade-in-up">{error}</p>}
          {result && !isLoading && !error && <ResultCard result={result} onRegenerate={handleGenerate} />}
          {!isLoading && !error && !result && (
            <div className="text-center text-slate-400 animate-fade-in-up">
              <p className="font-medium text-lg">លទ្ធផលរបស់អ្នកនឹងបង្ហាញនៅទីនេះ</p>
              <p className="text-sm mt-1">បំពេញព័ត៌មាន រួចចុចបង្កើត Caption</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default GeneratorPage;