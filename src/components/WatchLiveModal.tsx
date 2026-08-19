import React, { useState } from 'react';
import { Play, X, Volume2, MessageSquare, Heart, Share2, Sparkles, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WatchLiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenGiveModal: () => void;
}

export default function WatchLiveModal({ isOpen, onClose, onOpenGiveModal }: WatchLiveModalProps) {
  const [chatMessages, setChatMessages] = useState([
    { user: 'Grace M.', text: 'Good morning from Chicago! Blessed to worship with Kharis today! 🙏', time: '10:02 AM' },
    { user: 'Michael K.', text: 'The worship team sounds incredible today! 🔥', time: '10:04 AM' },
    { user: 'Sarah T.', text: 'Amen! Watching with my whole family.', time: '10:06 AM' },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [reactions, setReactions] = useState(142);

  if (!isOpen) return null;

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setChatMessages([
      ...chatMessages,
      { user: 'You', text: inputMsg, time: 'Just now' },
    ]);
    setInputMsg('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-[#15131f] rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl border border-[#2e2942] overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-[#2e2942]">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FD7F20] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FD7F20]"></span>
              </span>
              <div>
                <h3 className="font-extrabold text-lg text-[#f3f0f8]">Kharis Live Stream</h3>
                <p className="text-xs font-semibold text-[#a78bfa]">Sunday Morning Service • "Walking in Grace"</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#b2aec1] hover:text-[#f3f0f8] hover:bg-[#201d2e] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4 overflow-y-auto">
            
            {/* Main Video Stream Container */}
            <div className="lg:col-span-8 space-y-3">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center group shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-between p-4 z-10">
                  <div className="flex justify-between items-center">
                    <span className="bg-[#FD7F20] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider">
                      🔴 LIVE BROADCAST
                    </span>
                    <span className="bg-black/60 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md">
                      HD 1080p • 3,120 Viewers
                    </span>
                  </div>

                  <div className="my-auto text-center">
                    <div className="w-16 h-16 rounded-full bg-[#6B34FA] text-white flex items-center justify-center mx-auto shadow-2xl shadow-[#6B34FA]/50 group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 fill-white ml-1" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-white text-xs font-bold">
                    <span>Pastor David & Worship Band</span>
                    <span>10:00 AM - 11:30 AM EST</span>
                  </div>
                </div>
              </div>

              {/* Stream Action Controls */}
              <div className="flex items-center justify-between gap-2 pt-2">
                <button
                  onClick={() => setReactions(reactions + 1)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#201d2e] border border-[#2e2942] hover:bg-[#6B34FA] hover:text-white text-[#a78bfa] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Heart className="w-4 h-4 fill-current" />
                  <span>Amen ({reactions})</span>
                </button>

                <button
                  onClick={onOpenGiveModal}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#FD7F20] hover:bg-[#E06C14] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-[#FD7F20]/20"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>Give During Worship</span>
                </button>
              </div>
            </div>

            {/* Live Chat Panel */}
            <div className="lg:col-span-4 bg-[#1a1826] rounded-2xl p-3 border border-[#2e2942] flex flex-col h-[320px] lg:h-auto justify-between">
              <div className="text-xs font-extrabold text-[#a78bfa] uppercase tracking-wider pb-2 border-b border-[#2e2942] flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" />
                Live Community Chat
              </div>

              {/* Messages list */}
              <div className="flex-1 overflow-y-auto space-y-2.5 my-2 pr-1 text-xs">
                {chatMessages.map((msg, i) => (
                  <div key={i} className="bg-[#15131f] p-2.5 rounded-xl border border-[#2e2942] shadow-2xs">
                    <div className="flex justify-between items-center text-[10px] font-bold text-[#a78bfa]">
                      <span>{msg.user}</span>
                      <span className="text-[#b2aec1] font-normal">{msg.time}</span>
                    </div>
                    <p className="text-[#f3f0f8] font-semibold mt-0.5 leading-snug">{msg.text}</p>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendChat} className="flex items-center gap-1.5 pt-2 border-t border-[#2e2942]">
                <input
                  type="text"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  placeholder="Type a message or prayer..."
                  className="flex-1 px-3 py-2 text-xs font-semibold bg-[#15131f] text-[#f3f0f8] border border-[#2e2942] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6B34FA]"
                />
                <button
                  type="submit"
                  className="p-2 bg-[#6B34FA] text-white rounded-xl hover:bg-[#5420D6] transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
