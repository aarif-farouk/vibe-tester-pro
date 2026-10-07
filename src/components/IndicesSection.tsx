import React from 'react';
import { ChevronRight, ArrowDropUp, ArrowDropDown } from './Icons';
import { IndexItem, WorldIndexItem } from '../types';

interface IndicesSectionProps {
  indices: IndexItem[];
  worldIndices: WorldIndexItem[];
  onSelectIndex: (index: IndexItem | WorldIndexItem) => void;
  isDarkMode: boolean;
}

export const IndicesSection: React.FC<IndicesSectionProps> = ({
  indices,
  worldIndices,
  onSelectIndex,
  isDarkMode,
}) => {
  return (
    <section className="mb-10">
      {/* Section Header */}
      <h2
        className={`font-display text-2xl font-bold mb-4 flex items-center hover:text-[#2962ff] transition-colors cursor-pointer w-fit group ${
          isDarkMode ? 'text-white' : 'text-[#131722]'
        }`}
        id="indices-section-heading"
      >
        Indices
        <ChevronRight className="w-6 h-6 ml-0.5 group-hover:text-[#2962ff] group-hover:translate-x-0.5 transition-all" />
      </h2>

      {/* Top 3 Index Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {indices.map((idx) => {
          const isUp = idx.changePercent > 0;
          const isDown = idx.changePercent < 0;

          return (
            <div
              key={idx.id}
              onClick={() => onSelectIndex(idx)}
              className={`rounded-2xl p-4 flex items-center justify-between transition-all cursor-pointer group relative overflow-hidden border ${
                isDarkMode
                  ? 'bg-[#1e222d] hover:bg-[#2a2e39] border-[#2A2E39]'
                  : 'bg-[#f1f4fb] hover:bg-[#ebeef5] border-transparent hover:border-[#c3c5d8]'
              }`}
              id={`index-card-${idx.symbol.toLowerCase().replace(/\s+/g, '')}`}
            >
              <div className="flex items-center gap-3.5 relative z-10">
                <div
                  className={`w-10 h-10 rounded-xl ${
                    idx.badgeColor || (isDown ? 'bg-[#F23645]' : 'bg-[#2962ff]')
                  } text-white flex items-center justify-center font-bold text-sm shadow-md font-mono-data`}
                >
                  {idx.badge}
                </div>
                <div>
                  <div className={`font-semibold font-body text-sm md:text-base ${isDarkMode ? 'text-white' : 'text-[#131722]'}`}>
                    {idx.symbol}
                  </div>
                  <div className="text-xs font-mono-data text-[#6A6D78]">
                    {idx.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              <div className="text-right relative z-10">
                <div
                  className={`font-mono-data text-sm font-bold flex items-center justify-end ${
                    isUp ? 'text-[#089981]' : isDown ? 'text-[#F23645]' : 'text-[#6A6D78]'
                  }`}
                >
                  {isUp && <ArrowDropUp className="w-4 h-4" />}
                  {isDown && <ArrowDropDown className="w-4 h-4" />}
                  <span>
                    {isUp ? '+' : ''}
                    {idx.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* Background Sparkline Gradient */}
              <div
                className={`absolute bottom-0 left-0 w-full h-8 opacity-50 group-hover:opacity-100 transition-opacity ${
                  isUp ? 'sparkline-up' : isDown ? 'sparkline-down' : 'sparkline-neutral'
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* World Indices Table */}
      <div className="mb-4">
        <h3 className={`font-body text-sm font-semibold mb-3 flex items-center hover:text-[#2962ff] cursor-pointer w-fit group ${isDarkMode ? 'text-white' : 'text-[#131722]'}`}>
          World Indices Telemetry
          <ChevronRight className="w-4 h-4 ml-0.5 text-[#6A6D78] group-hover:text-[#2962ff] transition-colors" />
        </h3>

        <div
          className={`overflow-x-auto rounded-2xl border shadow-xs transition-colors ${
            isDarkMode ? 'bg-[#1e222d] border-[#2A2E39]' : 'bg-white border-[#c3c5d8]/40'
          }`}
        >
          <table className="w-full text-left border-collapse">
            <thead>
              <tr
                className={`border-b text-xs font-body uppercase tracking-wider ${
                  isDarkMode
                    ? 'bg-[#131722]/60 border-[#2A2E39] text-[#868993]'
                    : 'bg-[#f1f4fb]/60 border-[#c3c5d8]/50 text-[#6A6D78]'
                }`}
              >
                <th className="py-2.5 px-4 font-normal">Index</th>
                <th className="py-2.5 px-4 font-normal text-right">Price</th>
                <th className="py-2.5 px-4 font-normal text-right">Change %</th>
              </tr>
            </thead>
            <tbody className="font-mono-data text-xs">
              {worldIndices.map((wIdx, idx) => {
                const isUp = wIdx.changePercent >= 0;
                return (
                  <tr
                    key={wIdx.id}
                    onClick={() => onSelectIndex(wIdx)}
                    className={`transition-colors cursor-pointer h-10 ${
                      isDarkMode ? 'hover:bg-[#2a2e39]' : 'hover:bg-[#f1f4fb]'
                    } ${idx !== worldIndices.length - 1 ? (isDarkMode ? 'border-b border-[#2A2E39]/40' : 'border-b border-[#c3c5d8]/30') : ''}`}
                  >
                    <td className={`py-2 px-4 flex items-center gap-2.5 font-body ${isDarkMode ? 'text-white' : 'text-[#131722]'}`}>
                      <span className="w-2 h-2 rounded-full bg-[#2962ff]" />
                      <span className="font-semibold text-xs">{wIdx.name}</span>
                    </td>
                    <td className={`py-2 px-4 text-right ${isDarkMode ? 'text-white' : 'text-[#131722]'}`}>
                      {wIdx.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td
                      className={`py-2 px-4 text-right font-bold ${
                        isUp ? 'text-[#089981]' : 'text-[#F23645]'
                      }`}
                    >
                      {isUp ? '+' : ''}
                      {wIdx.changePercent.toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
