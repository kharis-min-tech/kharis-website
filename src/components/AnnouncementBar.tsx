import { useState } from 'react';
import { Sparkles, ArrowRight, X } from 'lucide-react';

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-[#F1ECFF] text-[#6B34FA] px-4 py-2 text-xs md:text-sm font-semibold border-b border-[#6B34FA]/10 transition-all">
      <div className="max-w-[1536px] mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="bg-[#6B34FA] text-white p-1 rounded-full text-[10px] flex items-center justify-center">
            <Sparkles className="w-3 h-3" />
          </span>
          <span className="font-medium text-[#1C1C1F]">
            Join us live this Sunday at 10:00 AM EST or online anywhere in the world!
          </span>
          <a
            href="#live"
            className="inline-flex items-center gap-1 font-bold text-[#6B34FA] hover:text-[#5420D6] underline underline-offset-2 ml-1"
          >
            Watch Online <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="text-[#6E6E76] hover:text-[#1C1C1F] p-1 rounded-md hover:bg-[#6B34FA]/10 transition-colors hidden sm:flex items-center justify-center"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
