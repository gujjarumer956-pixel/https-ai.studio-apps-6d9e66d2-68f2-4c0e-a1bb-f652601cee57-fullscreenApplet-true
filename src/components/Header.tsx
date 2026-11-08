import React from 'react';
import { Film, Sparkles, CreditCard, Play } from 'lucide-react';

interface HeaderProps {
  currentTab: 'studio' | 'showcase' | 'library' | 'pricing';
  onSelectTab: (tab: 'studio' | 'showcase' | 'library' | 'pricing') => void;
  credits: number;
  onOpenPricing: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  credits,
  onOpenPricing,
}) => {
  const freeVideosLeft = Math.floor(credits / 50);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
        
        {/* Zone 1: Single text element wordmark */}
        <a 
          href="/" 
          onClick={(e) => { e.preventDefault(); onSelectTab('studio'); }}
          className="text-xl font-extrabold tracking-tight text-white hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="w-7 h-7 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Film className="w-4 h-4" />
          </span>
          <span>ufg.ai</span>
        </a>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
          <button
            onClick={() => onSelectTab('studio')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              currentTab === 'studio'
                ? 'text-white border-amber-400 font-semibold'
                : 'border-transparent hover:text-neutral-200'
            }`}
          >
            Director Studio
          </button>
          <button
            onClick={() => onSelectTab('showcase')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              currentTab === 'showcase'
                ? 'text-white border-amber-400 font-semibold'
                : 'border-transparent hover:text-neutral-200'
            }`}
          >
            Showcase Library
          </button>
          <button
            onClick={() => onSelectTab('library')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              currentTab === 'library'
                ? 'text-white border-amber-400 font-semibold'
                : 'border-transparent hover:text-neutral-200'
            }`}
          >
            My Generations
          </button>
          <button
            onClick={() => onSelectTab('pricing')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              currentTab === 'pricing'
                ? 'text-white border-amber-400 font-semibold'
                : 'border-transparent hover:text-neutral-200'
            }`}
          >
            Pricing & Plans
          </button>
        </nav>

        {/* Zone 3: Primary Action & Credit Balance */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenPricing}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 hover:border-neutral-700 transition-colors"
            title={`${credits} credits available (~${freeVideosLeft} standard videos)`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono font-medium tabular-nums text-amber-400">{credits}</span>
            <span className="text-neutral-400 font-sans">credits</span>
            <span className="hidden sm:inline text-neutral-600">·</span>
            <span className="hidden sm:inline text-neutral-400 font-sans">{freeVideosLeft} {freeVideosLeft === 1 ? 'video' : 'videos'} left</span>
          </button>

          <button
            onClick={onOpenPricing}
            className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-all shadow-sm shadow-amber-500/20 whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Refill for $0.01</span>
          </button>
        </div>

      </div>
    </header>
  );
};
