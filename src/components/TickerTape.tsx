import React from 'react';
import { IndexItem, StockItem } from '../types';
import { ArrowDropUp, ArrowDropDown } from './Icons';

interface TickerTapeProps {
  items: (IndexItem | StockItem)[];
  onSelect: (item: IndexItem | StockItem) => void;
  isDarkMode: boolean;
}

export const TickerTape: React.FC<TickerTapeProps> = ({ items, onSelect, isDarkMode }) => {
  // Duplicate list to achieve continuous infinite ticker scroll
  const displayItems = [...items, ...items, ...items];

  return (
    <div
      className={`w-full overflow-hidden border-b text-xs font-mono-data py-1.5 transition-colors ${
        isDarkMode
          ? 'bg-[#0c0e15] border-[#2A2E39] text-[#d1d4dc]'
          : 'bg-[#f8f9fd] border-[#c3c5d8]/40 text-[#131722]'
      }`}
      id="live-ticker-tape"
    >
      <div className="animate-ticker flex items-center gap-6 px-4">
        {displayItems.map((item, idx) => {
          const price = 'price' in item ? item.price : 'value' in item ? item.value : 0;
          const isUp = item.changePercent >= 0;

          return (
            <div
              key={`${item.id}-${idx}`}
              onClick={() => onSelect(item)}
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity shrink-0"
            >
              <span className="font-bold font-body">{item.symbol}</span>
              <span className="font-medium">
                {price > 1000 ? price.toLocaleString('en-US', { minimumFractionDigits: 2 }) : price.toFixed(2)}
              </span>
              <span
                className={`flex items-center text-[11px] font-semibold px-1 py-0.2 rounded ${
                  isUp
                    ? 'text-[#089981] bg-[#089981]/10'
                    : 'text-[#F23645] bg-[#F23645]/10'
                }`}
              >
                {isUp ? <ArrowDropUp className="w-3.5 h-3.5" /> : <ArrowDropDown className="w-3.5 h-3.5" />}
                {isUp ? '+' : ''}
                {item.changePercent.toFixed(2)}%
              </span>
              <span className={`text-[#6A6D78] ${isDarkMode ? 'opacity-40' : 'opacity-30'}`}>|</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
