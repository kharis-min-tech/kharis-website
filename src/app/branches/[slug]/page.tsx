import React, { useState } from 'react';
import { 
  MapPin, 
  Clock, 
  Calendar, 
  Navigation, 
  ChevronRight, 
  Plus, 
  Minus, 
  Sparkles, 
  ArrowRight, 
  Heart, 
  Car, 
  Train, 
  Phone, 
  Mail, 
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BRANCHES_DATA, BranchData } from '../../../data/branchesData';
import PlanVisitModal from '../../../components/PlanVisitModal';
import GiveModal from '../../../components/GiveModal';
import KharisLogo from '../../../components/kharis-logo';
import SiteFooter from '../../../components/SiteFooter';

interface BranchTemplateProps {
  branchData?: BranchData;
  slug?: string;
  onNavigateBranch?: (slug: string) => void;
  onNavigateDirectory?: () => void;
}

export function BranchTemplate({
  branchData,
  slug = 'brighton',
  onNavigateBranch,
  onNavigateDirectory,
}: BranchTemplateProps) {
  const currentBranch = branchData || BRANCHES_DATA[slug] || BRANCHES_DATA['brighton'];

  const [zoomLevel, setZoomLevel] = useState(100);
  const [isPlanVisitOpen, setIsPlanVisitOpen] = useState(false);
  const [isGiveOpen, setIsGiveOpen] = useState(false);
  const [selectedEventRsvp, setSelectedEventRsvp] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden pt-[80px] selection:bg-[#6B34FA] selection:text-white flex flex-col">
      
      {/* Top Navbar */}
      <nav className="bg-black/95 backdrop-blur-md fixed top-0 w-full h-[80px] z-50 shadow-sm border-b border-white/10">
        <div className="flex justify-between items-center px-5 md:px-8 max-w-[1536px] mx-auto h-full">
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigateDirectory ? onNavigateDirectory() : (window.location.hash = '#/branches')}
              className="flex items-center gap-2 group text-left focus:outline-none transition-transform hover:scale-[0.98]"
              aria-label="Kharis Church Branches"
            >
              <KharisLogo size="md" />
            </button>

            {/* Branch Quick Switcher Dropdown */}
            <div className="relative ml-2">
              <button
                onClick={() => setBranchDropdownOpen(!branchDropdownOpen)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold border border-white/10 hover:bg-[#6B34FA] transition-all cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-[#FD7F20]" />
                <span>{currentBranch.name}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              <AnimatePresence>
                {branchDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-[#15131f] rounded-2xl shadow-2xl border border-white/10 p-2 z-50"
                  >
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-white/10 mb-1">
                      Switch Kharis Campus
                    </div>
                    {Object.values(BRANCHES_DATA).map((b) => (
                      <button
                        key={b.slug}
                        onClick={() => {
                          setBranchDropdownOpen(false);
                          if (onNavigateBranch) onNavigateBranch(b.slug);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                          b.slug === currentBranch.slug
                            ? 'bg-[#6B34FA] text-white'
                            : 'text-gray-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span>{b.name}</span>
                        <span className="text-[10px] opacity-80">{b.region}</span>
                      </button>
                    ))}
                    <div className="pt-1.5 mt-1 border-t border-white/10">
                      <button
                        onClick={() => {
                          setBranchDropdownOpen(false);
                          if (onNavigateDirectory) onNavigateDirectory();
                        }}
                        className="w-full text-center py-1.5 text-xs font-extrabold text-[#a78bfa] hover:underline cursor-pointer"
                      >
                        View All Branches Directory →
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 font-medium text-sm text-gray-300">
            <button
              onClick={() => onNavigateDirectory ? onNavigateDirectory() : null}
              className="text-[#a78bfa] font-bold border-b-2 border-[#6B34FA] pb-1 cursor-pointer"
            >
              Branches
            </button>
            <a href="#services" className="hover:text-white transition-colors pb-1">Service Times</a>
            <a href="#events" className="hover:text-white transition-colors pb-1">Events</a>
            <a href="#pastor" className="hover:text-white transition-colors pb-1">Leadership</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setIsGiveOpen(true)}
              className="text-xs font-bold text-white bg-[#FD7F20] hover:bg-[#e06b12] px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>Give Online</span>
            </button>
            <button
              onClick={() => setIsPlanVisitOpen(true)}
              className="text-xs font-bold bg-[#6B34FA] hover:bg-[#5420D6] text-white px-5 py-2.5 rounded-xl shadow-md shadow-[#6B34FA]/20 transition-all cursor-pointer"
            >
              Plan Your Visit
            </button>
          </div>

          <button
            onClick={() => setIsPlanVisitOpen(true)}
            className="md:hidden bg-[#6B34FA] hover:bg-[#5420D6] text-white px-3.5 py-2 rounded-xl text-xs font-bold"
          >
            Plan Visit
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="w-full">
        
        {/* HERO SECTION */}
        <section className="relative w-full min-h-[65vh] flex items-center justify-center pt-10 pb-16 px-5 md:px-8 max-w-[1536px] mx-auto">
          <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl mx-5 md:mx-8 mt-10 shadow-lg border border-white/10">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-90 scale-105 transform hover:scale-100 transition-transform duration-1000"
              style={{ backgroundImage: `url('${currentBranch.heroImage}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center max-w-4xl pt-16 text-white">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 shadow-sm">
              <MapPin className="w-4 h-4 text-[#FD7F20]" />
              <span className="font-semibold text-xs text-white uppercase tracking-wider">
                Kharis Church UK • {currentBranch.city} Campus
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight text-white">
              Welcome to <br />
              <span className="bg-gradient-to-r from-[#a78bfa] via-[#FD7F20] to-[#ffffff] bg-clip-text text-transparent">
                {currentBranch.name}
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl font-medium text-gray-300 max-w-2xl mb-10 leading-relaxed">
              {currentBranch.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button
                onClick={() => setIsPlanVisitOpen(true)}
                className="bg-[#6B34FA] hover:bg-[#5420D6] text-white font-extrabold text-sm px-8 py-4 rounded-2xl shadow-xl shadow-[#6B34FA]/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Plan Your Visit</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#events"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-extrabold text-sm px-8 py-4 rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer backdrop-blur-md"
              >
                <Calendar className="w-4 h-4 text-[#a78bfa]" />
                <span>Upcoming Events</span>
              </a>
            </div>
          </div>
        </section>

        {/* SERVICE TIMES & LOCATION BENTO GRID SECTION */}
        <section id="services" className="py-16 px-5 md:px-8 max-w-[1536px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Join Us This Sunday
            </h2>
            <p className="text-base font-medium text-gray-400 max-w-2xl mx-auto">
              We can't wait to host you. Choose a service time that works best for you and your family.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="bg-[#15131f] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-sm h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#a78bfa]">
                      <Clock className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Service Times</h3>
                      <p className="text-xs font-semibold text-gray-400">Sunday & Midweek Gathering</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {currentBranch.serviceTimes.map((service, index) => (
                      <div
                        key={index}
                        onClick={() => setIsPlanVisitOpen(true)}
                        className={`flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors group cursor-pointer border relative overflow-hidden ${
                          service.isHighlighted ? 'bg-white/10 border-[#6B34FA]/50' : 'bg-black/30 border-white/10'
                        }`}
                      >
                        {service.isHighlighted && (
                          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#FD7F20]" />
                        )}

                        <div className="flex-shrink-0 w-20 text-center">
                          <span className="block text-2xl font-extrabold text-[#a78bfa] mb-0.5">
                            {service.time}
                          </span>
                          <span className="text-[10px] font-extrabold text-gray-300 uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded-full">
                            {service.ampm}
                          </span>
                        </div>

                        <div className="flex-grow pt-0.5">
                          <h4 className="text-sm font-bold text-white mb-1 group-hover:text-[#a78bfa] transition-colors">
                            {service.name}
                          </h4>
                          <p className="text-xs font-medium text-gray-300 leading-relaxed">
                            {service.description}
                          </p>
                        </div>

                        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors pt-1" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center bg-black/40 p-4 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FD7F20] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FD7F20]"></span>
                    </span>
                    <span className="text-xs font-bold text-white">
                      Kids Ministry Available (Ages 0-12)
                    </span>
                  </div>
                  <button
                    onClick={() => setIsPlanVisitOpen(true)}
                    className="text-[#a78bfa] hover:underline text-xs font-bold cursor-pointer"
                  >
                    Reserve Seats
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="bg-[#15131f] rounded-3xl p-3 border border-white/10 shadow-sm h-[500px] relative overflow-hidden group">
                <div 
                  className="absolute inset-0 bg-black/50 rounded-2xl overflow-hidden transition-transform duration-300" 
                  style={{ transform: `scale(${zoomLevel / 100})` }}
                >
                  <div
                    className="w-full h-full bg-cover bg-center opacity-85"
                    style={{ backgroundImage: `url('${currentBranch.mapImage}')` }}
                  />

                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <div className="bg-[#6B34FA] text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-xl mb-2 relative flex items-center gap-1.5 whitespace-nowrap">
                      <Sparkles className="w-3.5 h-3.5 text-[#FD7F20] fill-[#FD7F20]" />
                      <span>{currentBranch.name}</span>
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#6B34FA]"></div>
                    </div>

                    <div className="relative w-8 h-8 flex justify-center items-center">
                      <div className="absolute inset-0 bg-[#FD7F20] rounded-full opacity-40 animate-ping"></div>
                      <div className="relative w-4 h-4 bg-[#FD7F20] border-2 border-white rounded-full shadow-md z-10"></div>
                    </div>
                  </div>
                </div>

                <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none">
                  <div className="bg-[#15131f]/95 backdrop-blur-md p-4 rounded-2xl max-w-xs pointer-events-auto shadow-lg border border-white/10 text-white">
                    <h4 className="font-bold text-sm text-white mb-1">
                      {currentBranch.name}
                    </h4>
                    <p className="font-medium text-xs text-gray-300 mb-3 leading-snug">
                      {currentBranch.fullAddress}
                    </p>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(currentBranch.fullAddress)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[#a78bfa] text-xs font-bold hover:underline"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Get Directions</span>
                    </a>
                  </div>

                  <div className="flex flex-col gap-2 pointer-events-auto">
                    <button
                      onClick={() => setZoomLevel(Math.min(zoomLevel + 10, 130))}
                      className="w-10 h-10 bg-[#15131f]/90 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:text-[#a78bfa] transition-colors shadow-md border border-white/10 cursor-pointer"
                      aria-label="Zoom In"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setZoomLevel(Math.max(zoomLevel - 10, 90))}
                      className="w-10 h-10 bg-[#15131f]/90 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:text-[#a78bfa] transition-colors shadow-md border border-white/10 cursor-pointer"
                      aria-label="Zoom Out"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LEAD PASTOR SECTION */}
        <section id="pastor" className="py-16 bg-[#15131f] border-y border-white/10">
          <div className="max-w-[1536px] mx-auto px-5 md:px-8">
            <div className="bg-black/40 rounded-3xl p-8 sm:p-12 border border-white/10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              <div className="md:col-span-5 relative">
                <div className="aspect-square rounded-3xl overflow-hidden shadow-xl border-4 border-white/10 bg-black">
                  <img
                    src={currentBranch.leadPastor.image}
                    alt={currentBranch.leadPastor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-[#6B34FA] text-white p-3.5 rounded-2xl shadow-lg">
                  <Sparkles className="w-6 h-6" />
                </div>
              </div>

              <div className="md:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-[#a78bfa] text-xs font-bold border border-white/10">
                  <span>Branch Leadership</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {currentBranch.leadPastor.name}
                </h3>
                <p className="text-xs font-bold text-[#a78bfa] uppercase tracking-wider">
                  {currentBranch.leadPastor.title}
                </p>
                <blockquote className="text-base font-medium text-gray-300 italic border-l-4 border-[#FD7F20] pl-4 my-4 leading-relaxed">
                  "{currentBranch.leadPastor.quote}"
                </blockquote>

                <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-gray-300">
                  <span className="flex items-center gap-1.5 bg-[#15131f] px-3 py-1.5 rounded-xl border border-white/10">
                    <Phone className="w-4 h-4 text-[#a78bfa]" />
                    {currentBranch.phone}
                  </span>
                  <span className="flex items-center gap-1.5 bg-[#15131f] px-3 py-1.5 rounded-xl border border-white/10">
                    <Mail className="w-4 h-4 text-[#a78bfa]" />
                    {currentBranch.email}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* UPCOMING EVENTS SECTION */}
        <section id="events" className="py-16 px-5 md:px-8 max-w-[1536px] mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-[#a78bfa] text-xs font-bold mb-2 border border-white/10">
                <Calendar className="w-3.5 h-3.5 text-[#FD7F20]" />
                <span>What's Happening</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white">
                Upcoming Events at {currentBranch.name}
              </h2>
            </div>

            <button
              onClick={() => setIsPlanVisitOpen(true)}
              className="text-xs font-bold text-[#a78bfa] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Full Calendar</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentBranch.upcomingEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-[#15131f] rounded-3xl overflow-hidden border border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-black">
                    <img
                      src={evt.image}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <span className="absolute top-3 left-3 bg-[#6B34FA] text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                      {evt.category}
                    </span>
                  </div>

                  <div className="p-6 space-y-2">
                    <div className="text-xs font-bold text-[#FD7F20] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{evt.date} • {evt.time}</span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-[#a78bfa] transition-colors leading-snug">
                      {evt.title}
                    </h3>

                    <p className="text-xs text-gray-300 font-medium leading-relaxed">
                      {evt.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-white/10 mt-4 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-gray-400">
                    📍 {evt.location}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedEventRsvp(evt.title);
                      setIsPlanVisitOpen(true);
                    }}
                    className="text-xs font-bold text-white bg-[#FD7F20] hover:bg-[#e06b12] px-4 py-2 rounded-xl transition-colors cursor-pointer shadow-sm"
                  >
                    RSVP
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TRANSIT & PARKING INFO SECTION */}
        <section className="py-16 bg-[#15131f] border-t border-white/10">
          <div className="max-w-[1536px] mx-auto px-5 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-black/40 p-6 sm:p-8 rounded-3xl border border-white/10 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 text-[#a78bfa] flex items-center justify-center">
                  <Car className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Parking Information</h3>
                <p className="text-sm text-gray-300 font-medium leading-relaxed">
                  {currentBranch.parkingInfo}
                </p>
              </div>

              <div className="bg-black/40 p-6 sm:p-8 rounded-3xl border border-white/10 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 text-[#a78bfa] flex items-center justify-center">
                  <Train className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Public Transit</h3>
                <p className="text-sm text-gray-300 font-medium leading-relaxed">
                  {currentBranch.transitInfo}
                </p>
              </div>

            </div>
          </div>
        </section>

      </main>

      <SiteFooter
        onNavigateDirectory={onNavigateDirectory}
        onOpenGiveModal={() => setIsGiveOpen(true)}
      />

      <PlanVisitModal
        isOpen={isPlanVisitOpen}
        onClose={() => setIsPlanVisitOpen(false)}
      />

      <GiveModal
        isOpen={isGiveOpen}
        onClose={() => setIsGiveOpen(false)}
      />

    </div>
  );
}

export default function DynamicBranchPage() {
  const resolvedSlug = typeof window !== 'undefined' 
    ? (window.location.hash.replace('#/branches/', '').replace('#', '') || 'brighton')
    : 'brighton';

  return <BranchTemplate slug={resolvedSlug} />;
}