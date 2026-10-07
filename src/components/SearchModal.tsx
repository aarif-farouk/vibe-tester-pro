import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { StockItem, IndexItem, WorldIndexItem } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  stocks: StockItem[];
  indices: IndexItem[];
  worldIndices: WorldIndexItem[];
  onSelect: (item: StockItem | IndexItem | WorldIndexItem) => void;
  isDarkMode: boolean;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  stocks,
  indices,
  worldIndices,
  onSelect,
  isDarkMode,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const allItems: (StockItem | IndexItem | WorldIndexItem)[] = [
    ...stocks,
    ...indices,
    ...worldIndices,
  ];

  const filtered = query.trim()
    ? allItems.filter(
        (item) =>
          item.symbol.toLowerCase().includes(query.toLowerCase()) ||
          item.name.toLowerCase().includes(query.toLowerCase())
      )
    : allItems.slice(0, 6);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className={`rounded-2xl w-full max-w-xl border shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 transition-colors ${
          isDarkMode
            ? 'bg-[#131722] border-[#2A2E39] text-[#d1d4dc]'
            : 'bg-white border-[#c3c5d8] text-[#131722]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Input Header */}
        <div
          className={`px-4 py-3.5 border-b flex items-center gap-3 ${
            isDarkMode ? 'bg-[#1e222d] border-[#2A2E39]' : 'bg-[#f1f4fb]/60 border-[#c3c5d8]/50'
          }`}
        >
          <Search className="w-5 h-5 text-[#2962ff] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search symbol, index, stock, crypto, forex..."
            className={`w-full bg-transparent border-none focus:outline-none font-body text-sm ${
              isDarkMode ? 'text-white placeholder-[#868993]' : 'text-[#131722] placeholder-[#6A6D78]'
            }`}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#6A6D78] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
              isDarkMode ? 'bg-[#2a2e39] text-[#d1d4dc]' : 'bg-[#dfe2e9] text-[#434656]'
            }`}
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 font-body text-xs">
          <div className="px-3 py-1.5 text-[11px] font-bold text-[#6A6D78] uppercase tracking-wider">
            {query.trim() ? `Search Results (${filtered.length})` : 'Popular Searches'}
          </div>

          {filtered.length === 0 ? (
            <div className="p-8 text-center text-[#6A6D78]">
              No instruments found matching "<span className="font-semibold">{query}</span>"
            </div>
          ) : (
            filtered.map((item) => {
              const price =
                'price' in item ? item.price : 'value' in item ? item.value : 0;
              const isUp = item.changePercent >= 0;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                  className={`p-3 rounded-xl cursor-pointer transition-colors flex justify-between items-center group ${
                    isDarkMode ? 'hover:bg-[#1e222d]' : 'hover:bg-[#f1f4fb]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#2962ff]/10 text-[#2962ff] font-bold flex items-center justify-center font-mono-data text-xs border border-[#2962ff]/20">
                      {item.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <div className={`font-bold font-mono-data flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-[#131722]'}`}>
                        {item.symbol}
                      </div>
                      <div className="text-[#6A6D78] text-xs">{item.name}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div className="font-mono-data">
                      <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-[#131722]'}`}>
                        ${price > 1000 ? price.toLocaleString() : price.toFixed(2)}
                      </div>
                      <div
                        className={`text-[11px] font-bold ${
                          isUp ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {isUp ? '+' : ''}
                        {item.changePercent.toFixed(2)}%
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#6A6D78] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div
          className={`px-4 py-2.5 border-t text-[11px] text-[#6A6D78] flex justify-between items-center ${
            isDarkMode ? 'bg-[#1e222d] border-[#2A2E39]' : 'bg-[#f1f4fb]/80 border-[#c3c5d8]/40'
          }`}
        >
          <span>Tip: Press Ctrl+K anytime</span>
          <span>TradingView Pro Global Telemetry</span>
        </div>
      </div>
    </div>
  );
};
