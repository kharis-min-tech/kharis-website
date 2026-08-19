import KharisLogo from './kharis-logo';

interface SiteFooterProps {
  onNavigateDirectory?: () => void;
  onOpenGiveModal?: () => void;
}

export default function SiteFooter({ onNavigateDirectory, onOpenGiveModal }: SiteFooterProps) {
  return (
    <footer className="bg-white w-full py-14 border-t border-[#F1ECFF] mt-auto">
      <div className="max-w-[1536px] mx-auto px-5 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <button
          type="button"
          onClick={() => onNavigateDirectory?.()}
          className="flex items-center gap-2 text-left cursor-pointer"
        >
          <KharisLogo size="sm" />
        </button>

        <div className="flex flex-wrap justify-center gap-6 text-sm font-semibold text-[#6E6E76]">
          {onNavigateDirectory && (
            <button
              type="button"
              onClick={onNavigateDirectory}
              className="hover:text-[#6B34FA] transition-all cursor-pointer"
            >
              Find a Branch
            </button>
          )}
          {onOpenGiveModal && (
            <button
              type="button"
              onClick={onOpenGiveModal}
              className="text-[#FD7F20] hover:text-[#e06b12] transition-all cursor-pointer"
            >
              Give Online
            </button>
          )}
          <a href="#" className="hover:text-[#6B34FA] transition-all">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-[#6B34FA] transition-all">
            Terms of Service
          </a>
          <a href="#" className="hover:text-[#6B34FA] transition-all">
            Accessibility
          </a>
        </div>

        <div className="text-xs font-semibold text-[#6E6E76] text-center md:text-right">
          © {new Date().getFullYear()} Kharis Church International.
        </div>
      </div>
    </footer>
  );
}
