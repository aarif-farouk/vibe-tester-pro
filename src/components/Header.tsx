import React, { useEffect } from 'react';
import { Search, Globe, User, Bookmark, Activity, Sun, Moon, Zap, Volume2, VolumeX, Sliders } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenWatchlist: () => void;
  watchlistCount: number;
  isLiveTicking: boolean;
  onToggleLiveTicking: () => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  viewMode: 'overview' | 'heatmap';
  onToggleViewMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenWatchlist,
  watchlistCount,
  isLiveTicking,
  onToggleLiveTicking,
  selectedCategory,
  onSelectCategory,
  isDarkMode,
  onToggleDarkMode,
  isSoundEnabled,
  onToggleSound,
  viewMode,
  onToggleViewMode,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSearch]);

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b transition-colors ${
        isDarkMode
          ? 'bg-[#131722] border-[#2A2E39] text-white'
          : 'bg-white border-[#c3c5d8]/40 text-[#131722]'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-2.5 flex justify-between items-center">
        {/* Left Section: Brand Logo & Search & Nav */}
        <div className="flex items-center gap-5">
          <a
            href="#"
            className="font-display text-2xl font-black flex items-center shrink-0 hover:opacity-90 transition-opacity gap-1.5"
            title="TradingView Pro Markets"
            id="tradingview-logo"
          >
            <svg
              className={isDarkMode ? 'text-[#2962ff]' : 'text-[#131722]'}
              width="34"
              height="26"
              viewBox="0 0 36 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14 22H9V28H14V22ZM24 22H19V28H24V22ZM24 16H19V22H24V16ZM29 16H34V22H29V16ZM24 10H19V16H24V10ZM29 10H34V16H29V10ZM24 4H19V10H24V4ZM29 4H34V10H29V4ZM14 4H9V10H14V4ZM4 4H9V10H4V4ZM14 10H9V16H14V10ZM4 10H9V16H4V10Z"
                fill="currentColor"
              />
            </svg>
            <span className={isDarkMode ? 'text-white' : 'text-[#131722]'}>TradingView</span>
            <span className="bg-gradient-to-r from-[#2962ff] to-[#00b8d9] text-white text-[10px] font-black px-1.5 py-0.5 rounded tracking-widest shadow-xs uppercase">
              PRO
            </span>
          </a>

          {/* Quick Search Bar */}
          <div
            onClick={onOpenSearch}
            className={`relative hidden md:flex items-center rounded-full px-3.5 py-1.5 text-xs w-60 cursor-pointer transition-colors border ${
              isDarkMode
                ? 'bg-[#1e222d] hover:bg-[#2a2e39] text-[#868993] border-[#2A2E39]'
                : 'bg-[#f1f4fb] hover:bg-[#ebeef5] text-[#6A6D78] border-transparent hover:border-[#c3c5d8]'
            }`}
            id="header-search-input"
          >
            <Search className="w-4 h-4 mr-2 text-[#6A6D78]" />
            <span className="flex-1 font-body text-xs">Symbol search (⌘K)</span>
            <kbd
              className={`hidden lg:inline-block text-[10px] font-mono-data px-1.5 py-0.5 rounded border ${
                isDarkMode
                  ? 'bg-[#2a2e39] text-[#d1d4dc] border-[#363a45]'
                  : 'bg-white text-[#434656] border-[#c3c5d8]'
              }`}
            >
              ⌘K
            </kbd>
          </div>

          {/* Main Pro Nav Navigation Items */}
          <nav className="hidden lg:flex items-center gap-1 font-body text-sm">
            <button
              onClick={() => onSelectCategory('US stocks')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                selectedCategory === 'US stocks'
                  ? 'text-[#2962ff]'
                  : isDarkMode
                  ? 'text-[#b2b5be] hover:text-white'
                  : 'text-[#6A6D78] hover:text-[#131722]'
              }`}
            >
              Markets
            </button>

            <button
              onClick={onToggleViewMode}
              className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 font-medium transition-colors ${
                viewMode === 'heatmap'
                  ? 'text-[#2962ff] font-bold'
                  : isDarkMode
                  ? 'text-[#b2b5be] hover:text-white'
                  : 'text-[#6A6D78] hover:text-[#131722]'
              }`}
              title="Toggle Heatmap View vs Overview Table"
              id="view-mode-toggle-btn"
            >
              <Sliders className="w-3.5 h-3.5" />
              {viewMode === 'heatmap' ? 'Heatmap Active' : 'Screener'}
            </button>

            <button
              onClick={() => onSelectCategory('Crypto')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedCategory === 'Crypto'
                  ? 'text-[#2962ff] font-bold'
                  : isDarkMode
                  ? 'text-[#b2b5be] hover:text-white'
                  : 'text-[#6A6D78] hover:text-[#131722]'
              }`}
            >
              Crypto
            </button>

            <button
              onClick={() => onSelectCategory('Forex')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedCategory === 'Forex'
                  ? 'text-[#2962ff] font-bold'
                  : isDarkMode
                  ? 'text-[#b2b5be] hover:text-white'
                  : 'text-[#6A6D78] hover:text-[#131722]'
              }`}
            >
              Forex & Futures
            </button>
          </nav>
        </div>

        {/* Right Section: Pro Dark Mode Toggle, Sound, Live Market Ticker & Watchlist */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Theme Switcher Toggle */}
          <button
            onClick={onToggleDarkMode}
            className={`p-2 rounded-full transition-all border ${
              isDarkMode
                ? 'bg-[#1e222d] hover:bg-[#2a2e39] text-[#f0b90b] border-[#2A2E39]'
                : 'bg-[#f1f4fb] hover:bg-[#ebeef5] text-[#131722] border-[#c3c5d8]/60'
            }`}
            title={isDarkMode ? 'Switch to Pro Light Theme' : 'Switch to Pro Dark Terminal Theme'}
            id="theme-toggle-btn"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-[#131722]" />}
          </button>

          {/* Sound Audio Alerts Toggle */}
          <button
            onClick={onToggleSound}
            className={`hidden sm:flex p-2 rounded-full transition-all border ${
              isSoundEnabled
                ? 'bg-[#089981]/10 text-[#089981] border-[#089981]/30'
                : isDarkMode
                ? 'bg-[#1e222d] text-[#6A6D78] border-[#2A2E39]'
                : 'bg-[#f1f4fb] text-[#6A6D78] border-transparent'
            }`}
            title={isSoundEnabled ? 'Audio Ticks Sound ON' : 'Audio Ticks Sound Muted'}
            id="audio-sound-toggle-btn"
          >
            {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Live Market Engine Simulation Toggle */}
          <button
            onClick={onToggleLiveTicking}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
              isLiveTicking
                ? 'bg-[#089981]/15 text-[#089981] border-[#089981]/40'
                : isDarkMode
                ? 'bg-[#1e222d] text-[#868993] border-[#2A2E39]'
                : 'bg-[#f1f4fb] text-[#6A6D78] border-transparent'
            }`}
            title="Toggle Live Telemetry Engine"
            id="toggle-live-ticks-btn"
          >
            <Activity className={`w-3.5 h-3.5 ${isLiveTicking ? 'animate-pulse' : ''}`} />
            <span>{isLiveTicking ? 'LIVE TICKING' : 'PAUSED'}</span>
          </button>

          {/* Watchlist Trigger */}
          <button
            onClick={onOpenWatchlist}
            className={`relative p-2 rounded-full transition-colors border ${
              isDarkMode
                ? 'bg-[#1e222d] hover:bg-[#2a2e39] text-[#d1d4dc] border-[#2A2E39]'
                : 'bg-[#f1f4fb] hover:bg-[#ebeef5] text-[#6A6D78] border-transparent hover:border-[#c3c5d8]'
            }`}
            title="Open Watchlist Panel"
            id="header-watchlist-btn"
          >
            <Bookmark className="w-4 h-4" />
            {watchlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#2962ff] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {watchlistCount}
              </span>
            )}
          </button>

          {/* Get Started / Upgrade Button */}
          <button
            onClick={onOpenWatchlist}
            className="bg-[#2962ff] text-white font-body text-xs font-semibold px-4 py-1.5 rounded-full hover:bg-[#0049db] transition-all shadow-md shrink-0 flex items-center gap-1.5"
            id="get-started-btn"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Pro Terminal</span>
          </button>
        </div>
      </div>
    </header>
  );
};
