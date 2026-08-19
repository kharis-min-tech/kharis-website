import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Search, 
  Clock, 
  ChevronRight, 
  Sparkles, 
  Compass, 
  Heart
} from 'lucide-react';
import { BRANCHES_DATA } from '../../data/branchesData';
import PlanVisitModal from '../../components/PlanVisitModal';
import GiveModal from '../../components/GiveModal';
import KharisLogo from '../../components/kharis-logo';
import SiteFooter from '../../components/SiteFooter';

interface BranchDirectoryProps {
  onSelectBranch?: (slug: string) => void;
  onNavigateDirectory?: () => void;
}

export function BranchDirectory({ onSelectBranch, onNavigateDirectory }: BranchDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [isPlanVisitOpen, setIsPlanVisitOpen] = useState(false);
  const [isGiveOpen, setIsGiveOpen] = useState(false);

  const regions = ['All', 'UK South', 'UK Midlands', 'UK North', 'Scotland'];

  const filteredBranches = useMemo(() => {
    return Object.values(BRANCHES_DATA).filter((b) => {
      const matchesSearch = 
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.postcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.address.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRegion = selectedRegion === 'All' || b.region === selectedRegion;

      return matchesSearch && matchesRegion;
    });
  }, [searchQuery, selectedRegion]);

  const handleBranchClick = (slug: string) => {
    if (onSelectBranch) {
      onSelectBranch(slug);
    } else {
      window.location.hash = `#/branches/${slug}`;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans pt-[80px] selection:bg-[#6B34FA] selection:text-white flex flex-col">
      
      {/* Directory Top Navigation Header */}
      <nav className="bg-black/95 backdrop-blur-md fixed top-0 w-full h-[80px] z-50 shadow-sm border-b border-white/10">
        <div className="flex justify-between items-center px-5 md:px-8 max-w-[1536px] mx-auto h-full">
          
          <button 
            onClick={() => onNavigateDirectory ? onNavigateDirectory() : (window.location.hash = '#/branches')}
            className="flex items-center gap-2 group text-left focus:outline-none transition-transform hover:scale-[0.98] cursor-pointer"
            aria-label="Kharis Church Branches Directory"
          >
            <KharisLogo size="md" />
          </button>

          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-400">
            <span className="text-[#a78bfa] font-bold border-b-2 border-[#6B34FA] pb-1">
              Branches Directory
            </span>
            <button 
              onClick={() => setIsGiveOpen(true)} 
              className="text-[#FD7F20] font-bold hover:text-[#e06b12] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-current" />
              Give Online
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsGiveOpen(true)}
              className="hidden sm:inline-flex text-xs font-bold text-white bg-[#FD7F20] hover:bg-[#e06b12] px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
            >
              Give Online
            </button>
            <button
              onClick={() => setIsPlanVisitOpen(true)}
              className="text-xs font-bold bg-[#6B34FA] hover:bg-[#5420D6] text-white px-5 py-2.5 rounded-xl shadow-md shadow-[#6B34FA]/20 transition-all cursor-pointer"
            >
              Plan Your Visit
            </button>
          </div>

        </div>
      </nav>

      {/* Directory Hero Banner */}
      <section className="bg-gradient-to-b from-[#15131f] via-black to-black text-white pt-14 pb-20 px-5 md:px-8 relative overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#6B34FA]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-20 w-80 h-80 bg-[#FD7F20]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1536px] mx-auto text-center space-y-6 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#e5dbff] text-xs font-bold shadow-sm">
            <Compass className="w-4 h-4 text-[#FD7F20]" />
            <span>Kharis Global & UK Network</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Find a <span className="bg-gradient-to-r from-[#a78bfa] via-[#FD7F20] to-[#ffffff] bg-clip-text text-transparent">Kharis Church Branch</span> Near You
          </h1>

          <p className="text-base sm:text-lg font-medium text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Wherever you are across the UK and beyond, there is a warm, vibrant Kharis family waiting to welcome you this Sunday.
          </p>

          <div className="max-w-2xl mx-auto pt-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by city, postcode, or branch name (e.g., Brighton, London, B5 6DY)..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-white/10 bg-[#15131f] text-white text-sm font-bold shadow-xl focus:outline-none focus:ring-2 focus:ring-[#6B34FA] placeholder-gray-400"
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {regions.map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedRegion === region
                      ? 'bg-[#6B34FA] text-white shadow-md shadow-[#6B34FA]/30'
                      : 'bg-white/10 text-white/90 hover:bg-white/20 border border-white/10'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Directory Listing Section */}
      <section className="py-16 px-5 md:px-8 max-w-[1536px] mx-auto w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-6 mb-8 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-extrabold text-white">
              Active Campus Locations ({filteredBranches.length})
            </h2>
            <p className="text-xs font-semibold text-gray-400">
              Showing UK & Regional Campuses
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-[#a78bfa] bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>All Services Feature Live Worship & Kids Ministry</span>
          </div>
        </div>

        {filteredBranches.length === 0 ? (
          <div className="bg-[#15131f] rounded-3xl p-12 text-center border border-white/10 shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-full bg-white/5 text-[#a78bfa] flex items-center justify-center mx-auto text-2xl font-extrabold">
              📍
            </div>
            <h3 className="text-xl font-bold text-white">No campuses matched your search</h3>
            <p className="text-sm font-medium text-gray-400 max-w-md mx-auto">
              Try searching for a different city, postcode, or select "All" regions above.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedRegion('All'); }}
              className="px-6 py-2.5 rounded-xl bg-[#6B34FA] text-white text-xs font-bold hover:bg-[#5420D6] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBranches.map((branch) => (
              <div
                key={branch.slug}
                className="bg-[#15131f] rounded-3xl overflow-hidden border border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-52 overflow-hidden bg-black">
                    <img
                      src={branch.heroImage}
                      alt={branch.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    
                    <span className="absolute top-3 left-3 bg-[#6B34FA] text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                      {branch.region}
                    </span>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="text-2xl font-extrabold leading-snug">
                        {branch.name}
                      </h3>
                      <p className="text-xs font-medium text-white/90 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#FD7F20]" />
                        {branch.address}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <p className="text-xs text-gray-300 font-medium leading-relaxed line-clamp-2">
                      {branch.description}
                    </p>

                    <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#a78bfa]" />
                        <span className="text-xs font-bold text-white">Sunday Service:</span>
                      </div>
                      <span className="text-xs font-extrabold text-[#a78bfa] bg-white/5 px-2.5 py-1 rounded-lg">
                        {branch.serviceTimes[0]?.time} {branch.serviceTimes[0]?.ampm}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {branch.facilities.slice(0, 3).map((fac, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-semibold bg-white/5 text-[#a78bfa] border border-white/5 px-2.5 py-1 rounded-md"
                        >
                          ✓ {fac}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-white/10 mt-2">
                  <button
                    onClick={() => handleBranchClick(branch.slug)}
                    className="w-full py-3.5 rounded-xl bg-[#6B34FA] hover:bg-[#5420D6] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#6B34FA]/20 transition-all cursor-pointer group-hover:translate-x-0.5"
                  >
                    <span>Explore {branch.city} Campus</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>

      <SiteFooter
        onNavigateDirectory={onNavigateDirectory}
        onOpenGiveModal={() => setIsGiveOpen(true)}
      />

      <PlanVisitModal isOpen={isPlanVisitOpen} onClose={() => setIsPlanVisitOpen(false)} />
      <GiveModal isOpen={isGiveOpen} onClose={() => setIsGiveOpen(false)} />

    </div>
  );
}

export default function BranchDirectoryPage() {
  return <BranchDirectory />;
}