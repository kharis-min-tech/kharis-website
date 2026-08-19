import { Sparkles, Heart, Users, Globe, BookOpen, ArrowRight } from 'lucide-react';

interface AboutSectionProps {
  onOpenVisitModal: () => void;
}

export default function AboutSection({ onOpenVisitModal }: AboutSectionProps) {
  const pillars = [
    {
      title: 'Unconditional Grace',
      desc: 'No matter where you come from or where you are on your spiritual journey, you belong here.',
      icon: Heart,
      color: 'bg-[#201d2e] text-[#a78bfa]',
    },
    {
      title: 'Authentic Fellowship',
      desc: 'Real relationships built in life groups, mentorships, and vibrant community gatherings.',
      icon: Users,
      color: 'bg-[#FD7F20]/15 text-[#FD7F20]',
    },
    {
      title: 'Transformational Impact',
      desc: 'Extending compassion through food pantries, youth mentorship, and global mission work.',
      icon: Globe,
      color: 'bg-[#201d2e] text-[#a78bfa]',
    },
    {
      title: 'Biblical Depth & Purpose',
      desc: 'Empowering practical teaching that equips you to live out your faith in daily life.',
      icon: BookOpen,
      color: 'bg-[#FD7F20]/15 text-[#FD7F20]',
    },
  ];

  return (
    <section id="about" className="py-16 sm:py-24 bg-[#15131f] border-t border-[#2e2942]">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#201d2e] border border-[#2e2942] text-[#a78bfa] text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#FD7F20]" />
            Who We Are
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#f3f0f8] tracking-tight">
            Built on Love, Driven by Purpose
          </h2>
          <p className="text-base sm:text-lg font-medium text-[#b2aec1]">
            Kharis is an open, welcoming community where faith becomes lived experience and every individual finds support to thrive.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const IconComp = pillar.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-[#1a1826] border border-[#2e2942] hover:border-[#6B34FA]/50 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl ${pillar.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-extrabold text-[#f3f0f8] mb-2">{pillar.title}</h3>
                  <p className="text-sm font-medium text-[#b2aec1] leading-relaxed">{pillar.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to action card */}
        <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-[#6B34FA] to-[#5420D6] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-[#6B34FA]/20">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-2xl font-extrabold">Ready to Experience Kharis Firsthand?</h3>
            <p className="text-sm font-semibold text-white/80">Join us in-person or online this Sunday at 10:00 AM EST.</p>
          </div>
          <button
            onClick={onOpenVisitModal}
            className="px-6 py-3.5 rounded-2xl bg-[#FD7F20] hover:bg-[#E06C14] text-white font-extrabold text-sm shadow-md transition-all active:scale-95 whitespace-nowrap flex items-center gap-2"
          >
            <span>Reserve Your Welcome Seat</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
