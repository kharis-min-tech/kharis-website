import { useState, useEffect } from 'react';
import { 
  Heart, 
  Play, 
  Menu, 
  X, 
  ChevronDown, 
  Users, 
  Sparkles, 
  Globe, 
  Calendar, 
  BookOpen 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import KharisLogo from './kharis-logo';

interface NavbarProps {
  onOpenGiveModal?: () => void;
  onOpenWatchModal?: () => void;
  onNavigateDirectory?: () => void;
  onNavigateBranch?: (slug: string) => void;
  onNavigateHome?: () => void;
  activeView?: string;
}

export default function Navbar({ 
  onOpenGiveModal, 
  onOpenWatchModal,
  onNavigateDirectory,
  onNavigateBranch,
  onNavigateHome,
  activeView = 'home'
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [branchesDropdown, setBranchesDropdown] = useState(false);
  const [ministriesDropdown, setMinistriesDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const branchQuickLinks = [
    { name: 'Brighton Branch', slug: 'brighton', desc: 'South Coast Campus' },
    { name: 'London Central', slug: 'london-central', desc: 'Holborn Viaduct' },
    { name: 'Birmingham', slug: 'birmingham', desc: 'Midlands Hub' },
    { name: 'Manchester', slug: 'manchester', desc: 'Oxford Road' },
    { name: 'Croydon', slug: 'croydon', desc: 'Wellesley Road' },
  ];

  const ministriesList = [
    { name: 'Kharis Youth & NextGen', desc: 'Inspiring young leaders & teens', icon: Sparkles },
    { name: 'Worship & Creative Arts', desc: 'Music, media, & creative expression', icon: Play },
    { name: 'Global Community Outreach', desc: 'Serving local & global communities', icon: Globe },
    { name: 'Kingdom Life Groups', desc: 'Weekly small group fellowship', icon: Users },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-[#15131f]/95 backdrop-blur-md shadow-lg border-b border-[#2e2942]' 
        : 'bg-[#0f0e15] border-b border-[#2e2942]'
    }`}>
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Official Clickable Kharis Logo */}
          <button 
            onClick={() => onNavigateHome ? onNavigateHome() : (window.location.hash = '#home')} 
            className="flex items-center gap-2 group text-left focus:outline-none transition-transform hover:scale-[0.98] cursor-pointer"
            aria-label="Kharis Church Home"
          >
            <KharisLogo size="md" />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => onNavigateHome ? onNavigateHome() : null}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                activeView === 'home' 
                  ? 'text-[#a78bfa] bg-[#201d2e]' 
                  : 'text-[#b2aec1] hover:text-[#f3f0f8] hover:bg-[#15131f]'
              }`}
            >
              Home
            </button>

            {/* Branches Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setBranchesDropdown(true)}
              onMouseLeave={() => setBranchesDropdown(false)}
            >
              <button
                onClick={() => onNavigateDirectory ? onNavigateDirectory() : null}
                type="button"
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer ${
                  activeView.startsWith('branch') || activeView === 'directory'
                    ? 'text-[#a78bfa] bg-[#201d2e]'
                    : 'text-[#b2aec1] hover:text-[#f3f0f8] hover:bg-[#15131f]'
                }`}
              >
                Branches
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                  branchesDropdown ? 'rotate-180 text-[#a78bfa]' : ''
                }`} />
              </button>

              <AnimatePresence>
                {branchesDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 w-80 bg-[#1a1826] rounded-2xl shadow-2xl border border-[#2e2942] p-2 mt-1 z-50"
                  >
                    <div className="px-3 py-2 border-b border-[#2e2942] mb-1 flex items-center justify-between">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#a78bfa]">
                        Kharis Locations
                      </p>
                      <button
                        onClick={() => {
                          setBranchesDropdown(false);
                          if (onNavigateDirectory) onNavigateDirectory();
                        }}
                        className="text-[11px] font-extrabold text-[#FD7F20] hover:underline cursor-pointer"
                      >
                        All Branches →
                      </button>
                    </div>
                    {branchQuickLinks.map((item) => (
                      <button
                        key={item.slug}
                        onClick={() => {
                          setBranchesDropdown(false);
                          if (onNavigateBranch) onNavigateBranch(item.slug);
                        }}
                        className="w-full text-left flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#201d2e] transition-colors group cursor-pointer"
                      >
                        <div className="p-2 rounded-lg bg-[#201d2e] text-[#a78bfa] group-hover:bg-[#6B34FA] group-hover:text-white transition-colors">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[#f3f0f8] group-hover:text-[#a78bfa] transition-colors">
                            {item.name}
                          </div>
                          <div className="text-xs font-medium text-[#b2aec1]">
                            {item.desc}
                          </div>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a
              href="#about"
              className="px-3.5 py-2 rounded-lg text-sm font-semibold text-[#b2aec1] hover:text-[#f3f0f8] hover:bg-[#15131f] transition-colors"
            >
              About Us
            </a>

            {/* Ministries Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setMinistriesDropdown(true)}
              onMouseLeave={() => setMinistriesDropdown(false)}
            >
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-[#b2aec1] hover:text-[#f3f0f8] hover:bg-[#15131f] transition-colors cursor-pointer"
              >
                Ministries
                <ChevronDown className={`w-4 h-4 text-[#b2aec1] transition-transform duration-200 ${
                  ministriesDropdown ? 'rotate-180 text-[#a78bfa]' : ''
                }`} />
              </button>

              <AnimatePresence>
                {ministriesDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 w-80 bg-[#1a1826] rounded-2xl shadow-2xl border border-[#2e2942] p-2 mt-1 z-50"
                  >
                    <div className="px-3 py-2 border-b border-[#2e2942] mb-1">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#a78bfa]">
                        Our Ministries
                      </p>
                    </div>
                    {ministriesList.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <a
                          key={item.name}
                          href={`#${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#201d2e] transition-colors group"
                        >
                          <div className="p-2 rounded-lg bg-[#201d2e] text-[#a78bfa] group-hover:bg-[#6B34FA] group-hover:text-white transition-colors">
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-[#f3f0f8] group-hover:text-[#a78bfa] transition-colors">
                              {item.name}
                            </div>
                            <div className="text-xs font-medium text-[#b2aec1]">
                              {item.desc}
                            </div>
                          </div>
                        </a>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a
              href="#events"
              className="px-3.5 py-2 rounded-lg text-sm font-semibold text-[#b2aec1] hover:text-[#f3f0f8] hover:bg-[#15131f] transition-colors"
            >
              Events
            </a>

            <a
              href="#sermons"
              className="px-3.5 py-2 rounded-lg text-sm font-semibold text-[#b2aec1] hover:text-[#f3f0f8] hover:bg-[#15131f] transition-colors"
            >
              Sermons
            </a>

            <a
              href="#connect"
              className="px-3.5 py-2 rounded-lg text-sm font-semibold text-[#b2aec1] hover:text-[#f3f0f8] hover:bg-[#15131f] transition-colors"
            >
              Connect
            </a>
          </nav>

          {/* Desktop Right CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={onOpenWatchModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#201d2e] hover:bg-[#6B34FA] text-[#a78bfa] hover:text-white text-sm font-bold transition-all duration-200 active:scale-95 border border-[#2e2942] cursor-pointer"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FD7F20] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FD7F20]"></span>
              </span>
              <Play className="w-4 h-4 fill-current" />
              <span>Watch Live</span>
            </button>

            <button
              onClick={onOpenGiveModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FD7F20] hover:bg-[#E06C14] text-white text-sm font-bold shadow-md shadow-[#FD7F20]/25 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-white text-white" />
              <span>Give</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenGiveModal}
              className="px-3.5 py-1.5 rounded-full bg-[#FD7F20] text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>Give</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#f3f0f8] hover:bg-[#201d2e] transition-colors focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#a78bfa]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-[#15131f] border-b border-[#2e2942] overflow-hidden"
          >
            <div className="px-4 pt-3 pb-6 space-y-2">
              <a
                href="#home"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-base font-bold text-[#a78bfa] bg-[#201d2e]"
              >
                Home
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateDirectory?.();
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-base font-bold text-[#FD7F20] hover:bg-[#1a1826]"
              >
                All Branches Directory →
              </button>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-base font-semibold text-[#b2aec1] hover:bg-[#1a1826]"
              >
                About Us
              </a>

              {/* Mobile CTA Buttons */}
              <div className="pt-3 border-t border-[#2e2942] flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenWatchModal?.();
                  }}
                  className="w-full py-3 rounded-xl bg-[#201d2e] text-[#a78bfa] font-bold text-sm flex items-center justify-center gap-2 border border-[#2e2942] cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-[#a78bfa]" />
                  Watch Live Sunday Broadcast
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenGiveModal?.();
                  }}
                  className="w-full py-3 rounded-xl bg-[#FD7F20] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#FD7F20]/20 cursor-pointer"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  Give Online & Support
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
