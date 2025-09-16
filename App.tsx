import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import GeneratorPage from './pages/GeneratorPage';
import Footer from './components/Footer';

type Page = 'landing' | 'generator';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('landing');

  const navigateTo = (targetPage: Page) => setPage(targetPage);

  const handleGetStarted = () => {
    navigateTo('generator');
  };

  let currentPage;
  if (page === 'generator') {
    currentPage = (
      <GeneratorPage 
        onBack={() => navigateTo('landing')} 
      />
    );
  } else {
    currentPage = <LandingPage onGetStarted={handleGetStarted} />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {currentPage}
      </main>
      <Footer />
    </div>
  );
};

export default App;