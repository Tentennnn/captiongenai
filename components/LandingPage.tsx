import React from 'react';
import { HeaderIcon, FeaturesTargetIcon, FeaturesMagicIcon, FeaturesHashtagIcon } from './icons';

interface LandingPageProps {
  onGetStarted: () => void;
}

const features = [
  {
    Icon: FeaturesTargetIcon,
    title: 'សម្រាប់គ្រប់ Platform',
    description: 'បង្កើត Caption សម្រាប់ Facebook, TikTok, និង YouTube ដោយ​គ្រាន់តែ​មួយ Click.'
  },
  {
    Icon: FeaturesMagicIcon,
    title: 'បង្កើតដោយ AI',
    description: 'ប្រើប្រាស់​បច្ចេកវិទ្យា AI ចុងក្រោយ ដើម្បី​បង្កើត​អត្ថបទ​ដែល​ទាក់ទាញ និង​មាន​ប្រសិទ្ធភាព'
  },
  {
    Icon: FeaturesHashtagIcon,
    title: 'Hashtags ដោយស្វ័យប្រវត្តិ',
    description: 'ទទួលបាន Hashtags ដែល​ពាក់ព័ន្ធ និង​ពេញនិយម​ដោយ​ស្វ័យប្រវត្តិ​'
  }
];

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6 lg:p-8 animate-fade-in-up">
      <header className="w-full max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
            <HeaderIcon className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-200">
            Caption Generator AI
            </h1>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center text-center pt-10">
        <div className="max-w-3xl">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-100 leading-tight">
            បង្កើត Caption ទាក់ទាញ​សម្រាប់​បណ្ដាញសង្គម​របស់អ្នក​
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto">
            សន្សំសំចៃពេលវេលា និងបង្កើន Engagement របស់អ្នកជាមួយ Caption ដែលបង្កើតដោយ AI ដ៏ឆ្លាតវៃ។
          </p>
          <button
            onClick={onGetStarted}
            className="mt-8 bg-blue-600 text-white font-bold py-4 px-8 rounded-full hover:bg-blue-500 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transform hover:-translate-y-1.5"
          >
            ចាប់ផ្ដើមបង្កើត
          </button>
        </div>

        <div className="w-full max-w-5xl mx-auto mt-20 sm:mt-24">
          <h3 className="text-2xl font-bold text-center mb-8 text-slate-200">មុខងារ​សំខាន់ៗ</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-700/80 text-center transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 text-blue-400 bg-blue-900/50 rounded-full">
                  <feature.Icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-semibold mb-2 text-slate-200">{feature.title}</h4>
                <p className="text-sm text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      {/* <footer className="text-center text-slate-400 text-sm mt-12">
        <p>&copy; {new Date().getFullYear()} Caption Generator AI. All rights reserved.</p>
      </footer> */}
    </div>
  );
};

export default LandingPage;