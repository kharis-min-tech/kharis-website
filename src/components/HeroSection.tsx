import { useState } from 'react';
import { 
  Play, 
  Heart, 
  ArrowRight, 
  Sparkles, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Volume2, 
  CheckCircle2, 
  Share2, 
  Flame,
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';

interface HeroSectionProps {
  onOpenGiveModal: () => void;
  onOpenWatchModal: () => void;
  onOpenVisitModal: () => void;
}

export default function HeroSection({
  onOpenGiveModal,
  onOpenWatchModal,
  onOpenVisitModal,
}: HeroSectionProps) {
  const [activeCardTab, setActiveCardTab] = useState<'stream' | 'schedule' | 'impact'>('stream');
  const [isPlayingTeaser, setIsPlayingTeaser] = useState(false);
  const [quickRsvpSubmitted, setQuickRsvpSubmitted] = useState(false);

  const upcomingServices = [
    { name: 'Sunday Morning Worship', time: '10:00 AM EST', location: 'Main Auditorium & Online' },
    { name: 'Midweek Believers Night', time: 'Wednesdays 7:00 PM', location: 'Chapel & YouTube Live' },
    { name: 'Kharis NextGen Youth', time: 'Fridays 6:30 PM', location: 'Youth Center' },
  ];

  return (
    <section className="relative overflow-hidden bg-[#0f0e15] pt-8 pb-16 lg:pt-16 lg:pb-24">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[#6B34FA]/10 rounded-full blur-3xl opacity-70 pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#FD7F20]/10 rounded-full blur-3xl opacity-60 pointer-events-none" />

      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline & Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            
            {/* Pill / Eyebrow Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#201d2e] border border-[#6B34FA]/30 text-[#a78bfa] text-xs sm:text-sm font-extrabold tracking-wide"
            >
              <Sparkles className="w-4 h-4 text-[#FD7F20] fill-[#FD7F20]" />
              <span className="uppercase tracking-wider">Welcome to Kharis</span>
              <span className="w-1 h-1 rounded-full bg-[#a78bfa]" />
              <span className="text-[#b2aec1] font-semibold">Faith • Grace • Purpose</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#f3f0f8] tracking-tight leading-[1.1]"
            >
              Where Grace Meets Purpose &{' '}
              <span className="text-[#a78bfa] relative inline-block">
                Community
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-[#FD7F20] opacity-80"
                  viewBox="0 0 100 20"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 15 Q 50 0 100 15"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{' '}
              Flourishes.
            </motion.h1>

            {/* Body Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg lg:text-xl font-medium text-[#b2aec1] max-w-2xl leading-relaxed"
            >
              At Kharis, we are a thriving, multigenerational family where everyone is welcomed with open arms. Discover your calling, deepen your faith, and experience transformational impact.
            </motion.p>

            {/* Primary Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-3 pt-2 w-full sm:w-auto"
            >
              {/* Main Site Button (Purple #6B34FA) */}
              <button
                onClick={onOpenVisitModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-[#6B34FA] hover:bg-[#5420D6] text-white font-bold text-base shadow-lg shadow-[#6B34FA]/30 transition-all duration-200 active:scale-95 group"
              >
                <span>Plan Your Visit</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Strong / Give CTA (Orange #FD7F20) */}
              <button
                onClick={onOpenGiveModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-[#FD7F20] hover:bg-[#E06C14] text-white font-bold text-base shadow-lg shadow-[#FD7F20]/25 transition-all duration-200 active:scale-95"
              >
                <Heart className="w-5 h-5 fill-white text-white" />
                <span>Give Online</span>
              </button>

              {/* Secondary Watch Sermon Button */}
              <button
                onClick={onOpenWatchModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-[#201d2e] hover:bg-[#6B34FA] text-[#a78bfa] hover:text-white border border-[#2e2942] font-bold text-base transition-colors duration-200"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Watch Stream</span>
              </button>
            </motion.div>

            {/* Trust & Community Proof Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-6 border-t border-[#2e2942] w-full grid grid-cols-3 gap-4 text-left"
            >
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#a78bfa]">5,000+</div>
                <div className="text-xs sm:text-sm font-semibold text-[#b2aec1]">Active Members</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#FD7F20]">40+</div>
                <div className="text-xs sm:text-sm font-semibold text-[#b2aec1]">Outreach Missions</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#f3f0f8]">100%</div>
                <div className="text-xs sm:text-sm font-semibold text-[#b2aec1]">Grace-Centered</div>
              </div>
            </motion.div>

          </div>

          {/* Right Column: High Fidelity Interactive Feature Card */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-[#15131f] rounded-3xl p-5 sm:p-6 shadow-2xl border border-[#2e2942] relative"
            >
              {/* Card Top Header Tabs */}
              <div className="flex items-center justify-between border-b border-[#2e2942] pb-4 mb-5">
                <div className="flex gap-1 bg-[#1a1826] p-1 rounded-xl">
                  <button
                    onClick={() => setActiveCardTab('stream')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeCardTab === 'stream'
                        ? 'bg-[#6B34FA] text-white shadow-md shadow-[#6B34FA]/20'
                        : 'text-[#b2aec1] hover:text-[#f3f0f8]'
                    }`}
                  >
                    Live Broadcast
                  </button>
                  <button
                    onClick={() => setActiveCardTab('schedule')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeCardTab === 'schedule'
                        ? 'bg-[#6B34FA] text-white shadow-md shadow-[#6B34FA]/20'
                        : 'text-[#b2aec1] hover:text-[#f3f0f8]'
                    }`}
                  >
                    Service Times
                  </button>
                  <button
                    onClick={() => setActiveCardTab('impact')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeCardTab === 'impact'
                        ? 'bg-[#6B34FA] text-white shadow-md shadow-[#6B34FA]/20'
                        : 'text-[#b2aec1] hover:text-[#f3f0f8]'
                    }`}
                  >
                    Our Impact
                  </button>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-[#FD7F20] bg-[#FD7F20]/10 px-2.5 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-[#FD7F20] animate-ping inline-block" />
                  <span>SUNDAY LIVE</span>
                </div>
              </div>

              {/* TAB 1: Live Stream Preview */}
              {activeCardTab === 'stream' && (
                <div className="space-y-4">
                  <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#1C1C1F] to-[#3A3A40] text-white aspect-video flex flex-col justify-between p-4 group">
                    
                    {/* Video Background Image / Gradient */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#6B34FA]/40 via-black/80 to-black/95 z-0" />

                    {/* Top overlay badge */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="bg-[#6B34FA] text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                        <Volume2 className="w-3 h-3" />
                        Current Series
                      </span>
                      <span className="bg-black/40 backdrop-blur-md text-white/90 text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[#FD7F20]" />
                        2,410 Watching
                      </span>
                    </div>

                    {/* Play Button Overlay */}
                    <div className="relative z-10 my-auto text-center flex flex-col items-center">
                      <button
                        onClick={() => setIsPlayingTeaser(!isPlayingTeaser)}
                        className="w-14 h-14 rounded-full bg-[#FD7F20] hover:bg-[#E06C14] text-white flex items-center justify-center shadow-xl shadow-[#FD7F20]/40 transform group-hover:scale-110 transition-transform duration-300"
                        aria-label="Play Sermon Video Teaser"
                      >
                        {isPlayingTeaser ? (
                          <span className="font-extrabold text-sm">PAUSE</span>
                        ) : (
                          <Play className="w-7 h-7 fill-white ml-1" />
                        )}
                      </button>
                      <p className="text-xs font-medium text-white/80 mt-2">
                        {isPlayingTeaser ? '▶ Playing Teaser Clip...' : 'Click to preview message'}
                      </p>
                    </div>

                    {/* Bottom Sermon Title Details */}
                    <div className="relative z-10">
                      <h3 className="font-extrabold text-lg leading-snug text-white">
                        "Unlocking Extraordinary Purpose"
                      </h3>
                      <p className="text-xs font-medium text-white/70">
                        Pastor David & Grace • Kharis Main Worship
                      </p>
                    </div>
                  </div>

                  {/* Actions inside card */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={onOpenWatchModal}
                      className="flex-1 py-3 px-4 rounded-xl bg-[#6B34FA] hover:bg-[#5420D6] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-[#6B34FA]/20 transition-all"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      Join Service Stream Now
                    </button>
                    <button 
                      onClick={() => alert("Sermon link copied to clipboard!")}
                      className="p-3 rounded-xl bg-[#201d2e] text-[#a78bfa] hover:bg-[#6B34FA] hover:text-white transition-colors border border-[#2e2942]"
                      title="Share Message"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: Service Schedule */}
              {activeCardTab === 'schedule' && (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-[#a78bfa] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#FD7F20]" />
                    Weekly Gathering Schedule
                  </div>
                  {upcomingServices.map((service, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-[#1a1826] border border-[#2e2942] hover:border-[#6B34FA]/50 transition-all flex items-start justify-between gap-3"
                    >
                      <div>
                        <h4 className="font-extrabold text-sm text-[#f3f0f8]">{service.name}</h4>
                        <div className="flex items-center gap-3 text-xs font-semibold text-[#b2aec1] mt-1">
                          <span className="flex items-center gap-1 text-[#a78bfa]">
                            <Clock className="w-3.5 h-3.5" />
                            {service.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#FD7F20]" />
                            {service.location}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={onOpenVisitModal}
                        className="text-xs font-bold text-[#a78bfa] bg-[#201d2e] hover:bg-[#6B34FA] hover:text-white px-2.5 py-1.5 rounded-lg transition-colors"
                      >
                        RSVP
                      </button>
                    </div>
                  ))}
                  
                  <button
                    onClick={onOpenVisitModal}
                    className="w-full py-3 rounded-xl bg-[#FD7F20] hover:bg-[#E06C14] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-[#FD7F20]/20 mt-2"
                  >
                    <MapPin className="w-4 h-4" />
                    Find Campus Directions & Parking
                  </button>
                </div>
              )}

              {/* TAB 3: Our Impact */}
              {activeCardTab === 'impact' && (
                <div className="space-y-3">
                  <div className="bg-[#201d2e] p-4 rounded-2xl text-center border border-[#2e2942]">
                    <div className="inline-flex p-2 rounded-xl bg-[#1a1826] text-[#FD7F20] mb-2 shadow-sm border border-[#2e2942]">
                      <Flame className="w-6 h-6 fill-[#FD7F20]" />
                    </div>
                    <h4 className="font-extrabold text-lg text-[#f3f0f8]">100% Impact Driven</h4>
                    <p className="text-xs font-medium text-[#b2aec1] mt-1">
                      Your generosity enables us to provide meals, youth education, and family counseling across our region.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-[#1a1826] p-3 rounded-xl border border-[#2e2942]">
                      <div className="text-xl font-extrabold text-[#a78bfa]">12,500+</div>
                      <div className="text-[11px] font-semibold text-[#b2aec1]">Meals Distributed</div>
                    </div>
                    <div className="bg-[#1a1826] p-3 rounded-xl border border-[#2e2942]">
                      <div className="text-xl font-extrabold text-[#FD7F20]">$320k+</div>
                      <div className="text-[11px] font-semibold text-[#b2aec1]">Global Missions</div>
                    </div>
                  </div>

                  <button
                    onClick={onOpenGiveModal}
                    className="w-full py-3 rounded-xl bg-[#FD7F20] hover:bg-[#E06C14] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-[#FD7F20]/25 transition-all"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    Partner with Us Through Giving
                  </button>
                </div>
              )}

              {/* Quick Card Footer: Interactive RSVP badge */}
              <div className="mt-5 pt-4 border-t border-[#2e2942] flex items-center justify-between text-xs text-[#b2aec1]">
                <span className="font-semibold text-[#f3f0f8] flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-[#a78bfa]" />
                  Next Service in 2 days
                </span>
                <button
                  onClick={onOpenVisitModal}
                  className="font-bold text-[#a78bfa] hover:text-[#6B34FA] flex items-center gap-0.5"
                >
                  Visit Guide <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
