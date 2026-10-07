import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { MarketCategory } from '../types';
import { CATEGORIES } from '../data/mockData';

interface HeroSectionProps {
  selectedCategory: MarketCategory;
  onSelectCategory: (cat: MarketCategory) => void;
  isDarkMode: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedCategory,
  onSelectCategory,
  isDarkMode,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <section className="text-center mb-8 pt-2">
      <div className="relative inline-block mb-4">
        <h1
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`font-display text-3xl md:text-5xl font-extrabold tracking-tight cursor-pointer hover:opacity-85 transition-opacity inline-flex items-center gap-2 ${
            isDarkMode ? 'text-white' : 'text-[#131722]'
          }`}
          id="hero-markets-title"
        >
          Markets, everywhere
          <ChevronDown className="w-7 h-7 md:w-9 md:h-9 transform transition-transform duration-200" />
        </h1>

        {/* Dropdown for quick category selection */}
        {isDropdownOpen && (
          <div
            className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 w-56 rounded-2xl shadow-2xl z-30 py-2 text-left border animate-in fade-in zoom-in-95 duration-150 ${
              isDarkMode ? 'bg-[#1e222d] border-[#2A2E39] text-white' : 'bg-white border-[#c3c5d8]'
            }`}
          >
            <div className="px-4 py-1.5 text-[10px] font-bold text-[#6A6D78] uppercase tracking-wider border-b border-[#2A2E39]/30 mb-1">
              Select Market Segment
            </div>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onSelectCategory(cat);
                  setIsDropdownOpen(false);
                }}
                className={`w-full px-4 py-2 text-sm flex items-center justify-between transition-colors ${
                  selectedCategory === cat
                    ? 'font-bold text-[#2962ff] bg-[#2962ff]/10'
                    : isDarkMode
                    ? 'text-[#d1d4dc] hover:bg-[#2a2e39]'
                    : 'text-[#131722] hover:bg-[#f1f4fb]'
                }`}
              >
                <span>{cat}</span>
                {selectedCategory === cat && <Check className="w-4 h-4 text-[#2962ff]" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Horizontal Category Filter Pills */}
      <div className="flex overflow-x-auto no-scrollbar justify-start md:justify-center gap-2 pb-2 px-2">
        {CATEGORIES.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`px-4 py-1.5 rounded-full font-body text-xs md:text-sm font-semibold whitespace-nowrap transition-all duration-150 ${
                isActive
                  ? isDarkMode
                    ? 'bg-[#2962ff] text-white shadow-md'
                    : 'bg-[#dfe2e9] text-[#131722] shadow-xs'
                  : isDarkMode
                  ? 'bg-[#1e222d] text-[#868993] hover:text-white border border-[#2A2E39]'
                  : 'bg-transparent hover:bg-[#f1f4fb] text-[#6A6D78] hover:text-[#131722]'
              }`}
              id={`category-pill-${category.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </section>
  );
};
