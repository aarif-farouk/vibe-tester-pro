import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TickerTape } from './components/TickerTape';
import { HeroSection } from './components/HeroSection';
import { IndicesSection } from './components/IndicesSection';
import { StockGridAndTable } from './components/StockGridAndTable';
import { MarketHeatmap } from './components/MarketHeatmap';
import { SidebarWidgets } from './components/SidebarWidgets';
import { StockDetailModal } from './components/StockDetailModal';
import { SearchModal } from './components/SearchModal';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { Footer } from './components/Footer';

import {
  MarketCategory,
  StockItem,
  IndexItem,
  WorldIndexItem,
} from './types';
import {
  INITIAL_INDICES,
  INITIAL_WORLD_INDICES,
  FEATURED_US_STOCKS,
  ALL_STOCKS,
  EARNINGS_CALENDAR,
  ECONOMIC_EVENTS,
} from './data/mockData';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<MarketCategory>('US stocks');
  const [stocks, setStocks] = useState<StockItem[]>(ALL_STOCKS);
  const [indices, setIndices] = useState<IndexItem[]>(INITIAL_INDICES);
  const [worldIndices, setWorldIndices] = useState<WorldIndexItem[]>(INITIAL_WORLD_INDICES);

  // Pro Layout States
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true); // Default Pro Dark Theme
  const [viewMode, setViewMode] = useState<'overview' | 'heatmap'>('overview');
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(false);

  // Saved Watchlist State (with localStorage persistence fallback)
  const [watchlistIds, setWatchlistIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('tv_watchlist_ids');
      return stored ? JSON.parse(stored) : ['nvda', 'aapl', 'btc'];
    } catch {
      return ['nvda', 'aapl', 'btc'];
    }
  });

  // UI Modal State
  const [selectedItem, setSelectedItem] = useState<StockItem | IndexItem | WorldIndexItem | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [isLiveTicking, setIsLiveTicking] = useState(true);

  // Audio Tick Chime Synthesizer
  const playTickSound = (isUp: boolean) => {
    if (!isSoundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(isUp ? 880 : 440, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) {
      console.warn('Audio play restricted', e);
    }
  };

  // Sync Watchlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tv_watchlist_ids', JSON.stringify(watchlistIds));
    } catch (e) {
      console.error(e);
    }
  }, [watchlistIds]);

  // Real-time market tick simulator
  useEffect(() => {
    if (!isLiveTicking) return;

    const interval = setInterval(() => {
      // Pick 1-2 random stocks to tick
      let tickedPositive = false;
      setStocks((prevStocks) =>
        prevStocks.map((stock) => {
          if (Math.random() > 0.4) return stock; // 60% chance to remain stable

          const deltaPercent = (Math.random() - 0.49) * 0.4;
          const newPrice = Math.max(0.01, stock.price * (1 + deltaPercent / 100));
          const newChangePercent = stock.changePercent + deltaPercent;
          if (deltaPercent > 0) tickedPositive = true;

          return {
            ...stock,
            price: Number(newPrice.toFixed(2)),
            changePercent: Number(newChangePercent.toFixed(2)),
          };
        })
      );

      if (isSoundEnabled) {
        playTickSound(tickedPositive);
      }

      // Pick 1 index to tick
      setIndices((prevIndices) =>
        prevIndices.map((idx) => {
          if (Math.random() > 0.5) return idx;
          const delta = (Math.random() - 0.49) * 0.15;
          return {
            ...idx,
            value: Number((idx.value * (1 + delta / 100)).toFixed(2)),
            changePercent: Number((idx.changePercent + delta).toFixed(2)),
          };
        })
      );
    }, 2800);

    return () => clearInterval(interval);
  }, [isLiveTicking, isSoundEnabled]);

  // Toggle Watchlist handler
  const handleToggleWatchlist = (id: string) => {
    setWatchlistIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleClearWatchlist = () => {
    setWatchlistIds([]);
  };

  // Watchlist stock items
  const watchlistStocks = stocks.filter((s) => watchlistIds.includes(s.id));

  // Ticker items combining indices and top stocks
  const tickerItems = [...indices, ...stocks.slice(0, 6)];

  return (
    <div
      className={`min-h-screen flex flex-col font-body antialiased transition-colors ${
        isDarkMode ? 'bg-[#131722] text-[#d1d4dc]' : 'bg-white text-[#131722]'
      }`}
    >
      {/* Top Ticker Marquee Bar */}
      <TickerTape
        items={tickerItems}
        onSelect={(item) => setSelectedItem(item)}
        isDarkMode={isDarkMode}
      />

      {/* Top Navbar Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
        watchlistCount={watchlistIds.length}
        isLiveTicking={isLiveTicking}
        onToggleLiveTicking={() => setIsLiveTicking(!isLiveTicking)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={() => setIsSoundEnabled(!isSoundEnabled)}
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode(viewMode === 'overview' ? 'heatmap' : 'overview')}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 md:px-8 py-6">
        {/* Hero Section with Market Dropdown & Pills */}
        <HeroSection
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          isDarkMode={isDarkMode}
        />

        {/* Indices Section */}
        <IndicesSection
          indices={indices}
          worldIndices={worldIndices}
          onSelectIndex={(idx) => setSelectedItem(idx)}
          isDarkMode={isDarkMode}
        />

        {/* Pro Market View Layout (Screener Overview vs Visual Heatmap) */}
        {viewMode === 'heatmap' ? (
          <div className="mb-10">
            <MarketHeatmap
              stocks={stocks}
              onSelectStock={(stk) => setSelectedItem(stk)}
              isDarkMode={isDarkMode}
            />
          </div>
        ) : (
          /* Grid layout for Stock Grid + Sidebar */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Main Stock Content Area (8 cols) */}
            <div className="lg:col-span-8">
              <StockGridAndTable
                category={selectedCategory}
                stocks={stocks}
                featuredStocks={FEATURED_US_STOCKS}
                onSelectStock={(stk) => setSelectedItem(stk)}
                watchlistIds={watchlistIds}
                onToggleWatchlist={handleToggleWatchlist}
                isDarkMode={isDarkMode}
              />
            </div>

            {/* Sidebar Widgets (4 cols) */}
            <div className="lg:col-span-4">
              <SidebarWidgets
                earnings={EARNINGS_CALENDAR}
                events={ECONOMIC_EVENTS}
                watchlistStocks={watchlistStocks}
                onSelectStock={(stk) => setSelectedItem(stk)}
                onOpenWatchlist={() => setIsWatchlistOpen(true)}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer isDarkMode={isDarkMode} />

      {/* Modals & Overlays */}
      <StockDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        isSaved={selectedItem ? watchlistIds.includes(selectedItem.id) : false}
        onToggleWatchlist={handleToggleWatchlist}
        isDarkMode={isDarkMode}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        stocks={stocks}
        indices={indices}
        worldIndices={worldIndices}
        onSelect={(item) => setSelectedItem(item)}
        isDarkMode={isDarkMode}
      />

      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        savedStocks={watchlistStocks}
        onRemove={handleToggleWatchlist}
        onClear={handleClearWatchlist}
        onSelectStock={(stk) => setSelectedItem(stk)}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
