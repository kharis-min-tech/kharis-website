import { Heart, MapPin, Phone, Mail, Globe, ArrowRight } from 'lucide-react';

interface FooterProps {
  onOpenGiveModal: () => void;
  onOpenVisitModal: () => void;
}

export default function Footer({ onOpenGiveModal, onOpenVisitModal }: FooterProps) {
  return (
    <footer className="bg-[#1C1C1F] text-white pt-16 pb-12 border-t border-[#3A3A40]">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#3A3A40]">
          
          {/* Brand Info Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#6B34FA] flex items-center justify-center text-white font-extrabold text-xl shadow-md">
                K<span className="w-2 h-2 rounded-full bg-[#FD7F20] inline-block ml-0.5" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">Kharis</span>
            </div>

            <p className="text-sm font-medium text-[#b2aec1] max-w-sm leading-relaxed">
              Kharis is a vibrant community centered on faith, compassion, and empowering individuals to discover extraordinary purpose in Christ.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={onOpenGiveModal}
                className="px-4 py-2 rounded-xl bg-[#FD7F20] hover:bg-[#E06C14] text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#FD7F20]/20 transition-all"
              >
                <Heart className="w-3.5 h-3.5 fill-white" />
                <span>Give Online</span>
              </button>
              <button
                onClick={onOpenVisitModal}
                className="px-4 py-2 rounded-xl bg-[#F1ECFF]/10 hover:bg-[#F1ECFF]/20 text-white font-bold text-xs transition-colors"
              >
                Plan Visit
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#6B34FA]">Quick Navigation</h4>
            <ul className="space-y-2 text-sm font-medium text-[#6E6E76]">
              <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">About Kharis</a></li>
              <li><a href="#events" className="hover:text-white transition-colors">Upcoming Events</a></li>
              <li><a href="#sermons" className="hover:text-white transition-colors">Sermon Archives</a></li>
              <li><a href="#connect" className="hover:text-white transition-colors">Life Groups</a></li>
            </ul>
          </div>

          {/* Ministries */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#FD7F20]">Ministries</h4>
            <ul className="space-y-2 text-sm font-medium text-[#6E6E76]">
              <li><a href="#" className="hover:text-white transition-colors">Kharis NextGen Youth</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Worship & Creative Arts</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Global Outreach</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Kingdom Women</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Men of Purpose</a></li>
            </ul>
          </div>

          {/* Campus Location & Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#6B34FA]">Gathering Location</h4>
            <div className="space-y-2 text-xs font-semibold text-[#6E6E76]">
              <p className="flex items-start gap-2 text-white/90">
                <MapPin className="w-4 h-4 text-[#FD7F20] shrink-0 mt-0.5" />
                <span>700 Grace Way, Metropolitan Campus, Building A</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#6B34FA] shrink-0" />
                <span>welcome@khariscommunity.org</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#6B34FA] shrink-0" />
                <span>+1 (800) 555-KHARIS</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-medium text-[#6E6E76] gap-4">
          <p>© {new Date().getFullYear()} Kharis Ministries & Community. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">Accessibility</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
