import React, { useState, useEffect } from 'react';
import { ChevronRight } from './Icons';
import { EarningsEvent, EconomicEvent, StockItem } from '../types';
import { Calendar, Clock, Star } from 'lucide-react';

interface SidebarWidgetsProps {
  earnings: EarningsEvent[];
  events: EconomicEvent[];
  watchlistStocks: StockItem[];
  onSelectStock: (stock: StockItem) => void;
  onOpenWatchlist: () => void;
  isDarkMode: boolean;
}

export const SidebarWidgets: React.FC<SidebarWidgetsProps> = ({
  earnings,
  events,
  watchlistStocks,
  onSelectStock,
  onOpenWatchlist,
  isDarkMode,
}) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 3, minutes: 45, seconds: 20 });
  const [showEventDetails, setShowEventDetails] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <aside className="space-y-6">
      {/* 1. Market Status Widget */}
      <div
        className={`rounded-2xl p-4 border transition-colors ${
          isDarkMode
            ? 'bg-[#1e222d] border-[#2A2E39] text-white'
            : 'bg-[#f1f4fb] border-[#c3c5d8]/50 text-[#131722]'
        }`}
      >
        <div className="flex justify-between items-center mb-3">
          <span className="font-semibold font-body text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#2962ff]" />
            Market Status
          </span>
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#089981]/20 text-[#089981] tracking-wider">
            OPEN
          </span>
        </div>
        <div className="text-xs text-[#6A6D78] font-body mb-2.5 flex justify-between items-center">
          <span>US Markets close in</span>
          <span className={`font-mono-data font-semibold ${isDarkMode ? 'text-white' : 'text-[#131722]'}`}>
            {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
          </span>
        </div>
        <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-[#131722]' : 'bg-[#dfe2e9]'}`}>
          <div
            className="bg-[#2962ff] h-full rounded-full transition-all duration-1000"
            style={{ width: `${((3.75 - timeLeft.hours) / 6.5) * 100 + 40}%` }}
          />
        </div>
      </div>

      {/* 2. Earnings Calendar Mini Widget */}
      <div
        className={`rounded-2xl border overflow-hidden shadow-xs transition-colors ${
          isDarkMode ? 'bg-[#1e222d] border-[#2A2E39]' : 'bg-white border-[#c3c5d8]/60'
        }`}
      >
        <div
          className={`px-4 py-3 border-b flex justify-between items-center ${
            isDarkMode ? 'bg-[#131722]/60 border-[#2A2E39]' : 'bg-[#f1f4fb]/70 border-[#c3c5d8]/40'
          }`}
        >
          <h3 className={`font-body text-sm font-semibold flex items-center justify-between w-full ${isDarkMode ? 'text-white' : 'text-[#131722]'}`}>
            <span>Earnings Calendar</span>
            <ChevronRight className="w-4 h-4 text-[#6A6D78]" />
          </h3>
        </div>
        <ul className={`divide-y ${isDarkMode ? 'divide-[#2A2E39]' : 'divide-[#c3c5d8]/30'}`}>
          {earnings.map((item) => (
            <li
              key={item.id}
              className={`p-3.5 cursor-pointer transition-colors flex justify-between items-center group ${
                isDarkMode ? 'hover:bg-[#2a2e39]/50' : 'hover:bg-[#f1f4fb]'
              }`}
            >
              <div>
                <div className="font-bold text-[#2962ff] font-mono-data text-xs flex items-center gap-1.5">
                  {item.symbol}
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-normal ${
                      isDarkMode ? 'bg-[#2a2e39] text-[#d1d4dc]' : 'bg-[#dfe2e9] text-[#434656]'
                    }`}
                  >
                    {item.period}
                  </span>
                </div>
                <div className="text-xs text-[#6A6D78] font-body mt-0.5">{item.name}</div>
              </div>
              <div className="text-right font-mono-data text-xs">
                <div>
                  Act: <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-[#131722]'}`}>{item.act}</span>
                </div>
                <div className="text-[#6A6D78] text-[11px]">Est: {item.est}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 3. Economic Events Widget */}
      <div
        className={`rounded-2xl border overflow-hidden shadow-xs transition-colors ${
          isDarkMode ? 'bg-[#1e222d] border-[#2A2E39]' : 'bg-white border-[#c3c5d8]/60'
        }`}
      >
        <div
          className={`px-4 py-3 border-b flex justify-between items-center ${
            isDarkMode ? 'bg-[#131722]/60 border-[#2A2E39]' : 'bg-[#f1f4fb]/70 border-[#c3c5d8]/40'
          }`}
        >
          <h3 className={`font-body text-sm font-semibold flex items-center justify-between w-full ${isDarkMode ? 'text-white' : 'text-[#131722]'}`}>
            <span>Economic Events</span>
            <button
              onClick={() => setShowEventDetails(!showEventDetails)}
              className="text-xs text-[#2962ff] hover:underline"
            >
              {showEventDetails ? 'Summary' : 'Details'}
            </button>
          </h3>
        </div>

        {!showEventDetails ? (
          <div className="p-5 text-center">
            <Calendar className="w-8 h-8 text-[#6A6D78] mx-auto mb-2 opacity-60" />
            <p className="text-xs text-[#6A6D78] font-body">No high-impact events scheduled</p>
          </div>
        ) : (
          <div className="p-3 space-y-2 font-body text-xs">
            {events.map((evt) => (
              <div
                key={evt.id}
                className={`p-2 rounded-lg ${isDarkMode ? 'bg-[#131722]' : 'bg-[#f1f4fb]'}`}
              >
                <div className={`flex justify-between items-center font-semibold ${isDarkMode ? 'text-white' : 'text-[#131722]'}`}>
                  <span>{evt.title}</span>
                  <span className="text-[10px] px-1 rounded bg-[#2962ff]/10 text-[#2962ff]">
                    {evt.impact.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-[#6A6D78] mt-1 font-mono-data">
                  <span>Actual: {evt.actual}</span>
                  <span>Forecast: {evt.forecast}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Watchlist Snapshot Card */}
      {watchlistStocks.length > 0 && (
        <div
          className={`rounded-2xl border p-4 shadow-xs transition-colors ${
            isDarkMode ? 'bg-[#1e222d] border-[#2A2E39]' : 'bg-white border-[#c3c5d8]/60'
          }`}
        >
          <div className="flex justify-between items-center mb-3">
            <h4 className={`font-body text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${isDarkMode ? 'text-white' : 'text-[#131722]'}`}>
              <Star className="w-3.5 h-3.5 fill-[#2962ff] text-[#2962ff]" />
              Watchlist ({watchlistStocks.length})
            </h4>
            <button
              onClick={onOpenWatchlist}
              className="text-xs text-[#2962ff] font-semibold hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-2">
            {watchlistStocks.slice(0, 3).map((stk) => {
              const isUp = stk.changePercent >= 0;
              return (
                <div
                  key={stk.id}
                  onClick={() => onSelectStock(stk)}
                  className={`flex justify-between items-center p-2 rounded-lg cursor-pointer transition-colors ${
                    isDarkMode ? 'hover:bg-[#2a2e39]' : 'hover:bg-[#f1f4fb]'
                  }`}
                >
                  <div className="font-mono-data text-xs">
                    <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-[#131722]'}`}>{stk.symbol}</span>
                    <span className="text-[11px] text-[#6A6D78] block font-body">{stk.name}</span>
                  </div>
                  <div className="text-right font-mono-data text-xs">
                    <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-[#131722]'}`}>${stk.price.toFixed(2)}</div>
                    <div
                      className={`text-[11px] font-medium ${
                        isUp ? 'text-[#089981]' : 'text-[#F23645]'
                      }`}
                    >
                      {isUp ? '+' : ''}
                      {stk.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
};
