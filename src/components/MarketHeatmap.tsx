import React from 'react';
import { StockItem } from '../types';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MarketHeatmapProps {
  stocks: StockItem[];
  onSelectStock: (stock: StockItem) => void;
  isDarkMode: boolean;
}

export const MarketHeatmap: React.FC<MarketHeatmapProps> = ({
  stocks,
  onSelectStock,
  isDarkMode,
}) => {
  // Group stocks by Sector for Pro Heatmap layout
  const sectors = Array.from(new Set(stocks.map((s) => s.sector || 'Technology')));

  const getHeatColor = (changePercent: number) => {
    if (changePercent >= 3.0) return 'bg-[#089981] text-white';
    if (changePercent >= 1.0) return 'bg-[#089981]/80 text-white';
    if (changePercent >= 0) return 'bg-[#089981]/40 text-[#089981] dark:text-emerald-300';
    if (changePercent >= -1.0) return 'bg-[#F23645]/40 text-[#F23645] dark:text-red-300';
    if (changePercent >= -3.0) return 'bg-[#F23645]/80 text-white';
    return 'bg-[#F23645] text-white';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center font-body">
        <div>
          <h2 className="font-display text-xl font-extrabold flex items-center gap-2">
            <span>Market Heatmap</span>
            <span className="text-xs bg-[#2962ff] text-white font-mono-data px-2 py-0.5 rounded font-bold uppercase">
              PRO VISUALIZER
            </span>
          </h2>
          <p className="text-xs text-[#6A6D78]">
            Visual breakdown of S&P 500 performance sized by volume & relative change.
          </p>
        </div>

        {/* Color Legend */}
        <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono-data">
          <span className="text-[#F23645] font-bold">-3%</span>
          <div className="h-3 w-28 rounded-full bg-gradient-to-r from-[#F23645] via-gray-400 to-[#089981]" />
          <span className="text-[#089981] font-bold">+3%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sectors.map((sectorName) => {
          const sectorStocks = stocks.filter((s) => (s.sector || 'Technology') === sectorName);
          if (sectorStocks.length === 0) return null;

          return (
            <div
              key={sectorName}
              className={`p-4 rounded-2xl border transition-colors ${
                isDarkMode ? 'bg-[#1e222d] border-[#2A2E39]' : 'bg-white border-[#c3c5d8]/50 shadow-xs'
              }`}
            >
              <div className="text-xs font-bold font-body uppercase tracking-wider text-[#6A6D78] mb-3 flex justify-between">
                <span>{sectorName}</span>
                <span>{sectorStocks.length} Assets</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {sectorStocks.map((stock) => {
                  const isUp = stock.changePercent >= 0;
                  const colorClass = getHeatColor(stock.changePercent);

                  return (
                    <div
                      key={stock.id}
                      onClick={() => onSelectStock(stock)}
                      className={`p-3 rounded-xl cursor-pointer transition-all hover:scale-[1.03] shadow-xs flex flex-col justify-between h-24 ${colorClass}`}
                      id={`heatmap-tile-${stock.symbol}`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-display font-extrabold text-sm">{stock.symbol}</span>
                        {isUp ? (
                          <ArrowUpRight className="w-4 h-4 shrink-0" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 shrink-0" />
                        )}
                      </div>

                      <div className="text-xs font-body opacity-90 truncate">{stock.name}</div>

                      <div className="flex justify-between items-baseline font-mono-data text-xs mt-1">
                        <span className="font-bold">${stock.price.toFixed(2)}</span>
                        <span className="font-black">
                          {isUp ? '+' : ''}
                          {stock.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
