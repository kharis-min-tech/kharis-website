import { useState, useEffect } from 'react';
import { BranchTemplate } from './app/branches/[slug]/page';
import { BranchDirectory } from './app/branches/page';
import { BRANCHES_DATA } from './data/branchesData';
import { MapPin, Compass } from 'lucide-react';

export default function App() {
  // Active view: 'directory' or 'branch-[slug]' (defaulting to directory view)
  const [currentView, setCurrentView] = useState<string>('directory');
  const [currentSlug, setCurrentSlug] = useState<string>('brighton');

  // Sync hash routing with URL state
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/branches/')) {
        const slug = hash.replace('#/branches/', '');
        if (BRANCHES_DATA[slug]) {
          setCurrentSlug(slug);
          setCurrentView(`branch-${slug}`);
        }
      } else {
        setCurrentView('directory');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigateBranch = (slug: string) => {
    setCurrentSlug(slug);
    setCurrentView(`branch-${slug}`);
    window.location.hash = `#/branches/${slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateDirectory = () => {
    setCurrentView('directory');
    window.location.hash = '#/branches';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black font-sans text-white flex flex-col selection:bg-[#6B34FA] selection:text-white">
      
      {/* Branches Feature Toolbar */}
      <div className="bg-[#1C1C1F] text-white py-2 px-4 text-xs font-semibold flex flex-wrap items-center justify-between gap-2 border-b border-white/10 z-[60]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FD7F20] animate-pulse" />
          <span className="text-white/80">Kharis Church Branches Module:</span>
          <span className="font-extrabold text-white bg-[#6B34FA] px-2 py-0.5 rounded">
            {currentView === 'directory' ? 'All Branches Directory' : `Campus: ${BRANCHES_DATA[currentSlug]?.name}`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleNavigateDirectory}
            className={`px-3 py-1 rounded-full text-[11px] font-extrabold transition-all flex items-center gap-1 cursor-pointer ${
              currentView === 'directory'
                ? 'bg-[#6B34FA] text-white shadow-sm'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <Compass className="w-3 h-3 text-white" />
            <span>Branches Directory</span>
          </button>

          <button
            onClick={() => handleNavigateBranch('brighton')}
            className={`px-3 py-1 rounded-full text-[11px] font-extrabold transition-all flex items-center gap-1 cursor-pointer ${
              currentView === 'branch-brighton'
                ? 'bg-[#FD7F20] text-white shadow-sm'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <MapPin className="w-3 h-3 text-white" />
            <span>Brighton Campus</span>
          </button>
        </div>
      </div>

      {/* Render Branches Directory or Specific Branch Campus */}
      {currentView === 'directory' ? (
        <BranchDirectory
          onSelectBranch={handleNavigateBranch}
          onNavigateDirectory={handleNavigateDirectory}
        />
      ) : (
        <BranchTemplate
          slug={currentSlug}
          onNavigateBranch={handleNavigateBranch}
          onNavigateDirectory={handleNavigateDirectory}
        />
      )}

    </div>
  );
}
