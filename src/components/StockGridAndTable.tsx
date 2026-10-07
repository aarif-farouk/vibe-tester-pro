import React, { useState, useMemo } from 'react';
import { ChevronRight } from './Icons';
import { StockItem, MarketCategory } from '../types';
import { Search, Star } from 'lucide-react';

interface StockGridAndTableProps {
  category: MarketCategory;
  stocks: StockItem[];
  featuredStocks: StockItem[];
  onSelectStock: (stock: StockItem) => void;
  watchlistIds: string[];
  onToggleWatchlist: (stockId: string) => void;
  isDarkMode: boolean;
}

type TabType = 'volume' | 'gainers' | 'losers' | 'marketCap';

export const StockGridAndTable: React.FC<StockGridAndTableProps> = ({
  category,
  stocks,
  featuredStocks,
  onSelectStock,
  watchlistIds,
  onToggleWatchlist,
  isDarkMode,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('volume');
  const [tableSearch, setTableSearch] = useState('');

  // Filter stocks by selected market category
  const filteredCategoryStocks = useMemo(() => {
    return stocks.filter((s) => s.category === category || category === 'US stocks');
  }, [stocks, category]);

  // Sort stocks depending on tab selection
  const sortedStocks = useMemo(() => {
    let list = [...filteredCategoryStocks];

    if (tableSearch.trim()) {
      const query = tableSearch.toLowerCase();
      list = list.filter(
        (s) => s.symbol.toLowerCase().includes(query) || s.name.toLowerCase().includes(query)
      );
    }

    switch (activeTab) {
      case 'gainers':
        return list.sort((a, b) => b.changePercent - a.changePercent);
      case 'losers':
        return list.sort((a, b) => a.changePercent - b.changePercent);
      case 'marketCap':
        return list.sort((a, b) => b.rawVolume - a.rawVolume);
      case 'volume':
      default:
        return list.sort((a, b) => b.rawVolume - a.rawVolume);
    }
  }, [filteredCategoryStocks, activeTab, tableSearch]);

  return (
    <section className="space-y-6">
      {/* Category Section Title */}
      <h2
        className={`font-display text-2xl font-bold mb-4 flex items-center hover:text-[#2962ff] transition-colors cursor-pointer w-fit group ${
          isDarkMode ? 'text-white' : 'text-[#131722]'
        }`}
        id="us-stocks-section-heading"
      >
        {category}
        <ChevronRight className="w-6 h-6 ml-0.5 group-hover:text-[#2962ff] group-hover:translate-x-0.5 transition-all" />
      </h2>

      {/* 4 Featured Stock Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {featuredStocks.slice(0, 4).map((stock) => (
          <div
            key={stock.id}
            onClick={() => onSelectStock(stock)}
            className={`p-3.5 rounded-2xl cursor-pointer transition-all text-center border group ${
              isDarkMode
                ? 'bg-[#1e222d] hover:bg-[#2a2e39] border-[#2A2E39]'
                : 'bg-[#f1f4fb] hover:bg-[#ebeef5] border-transparent hover:border-[#c3c5d8]'
            }`}
            id={`stock-card-${stock.symbol.toLowerCase()}`}
          >
            <div
              className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center shadow-xs mb-2.5 group-hover:scale-105 transition-transform ${
                isDarkMode ? 'bg-[#131722] border border-[#2A2E39]' : 'bg-white'
              }`}
            >
              {stock.logoUrl ? (
                <img
                  src={stock.logoUrl}
                  alt={`${stock.name} logo`}
                  className="w-8 h-8 object-contain rounded-full"
                />
              ) : (
                <span className="font-bold text-[#2962ff] text-sm">{stock.logoInitials}</span>
              )}
            </div>
            <div className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-[#131722]'}`}>
              {stock.name}
            </div>
            <div className="text-xs text-[#6A6D78] font-mono-data mt-0.5">{stock.symbol}</div>
          </div>
        ))}
      </div>

      {/* Complex Data Table Card */}
      <div
        className={`rounded-2xl border overflow-hidden shadow-xs transition-colors ${
          isDarkMode ? 'bg-[#1e222d] border-[#2A2E39]' : 'bg-white border-[#c3c5d8]/60'
        }`}
      >
        {/* Table Control Header */}
        <div
          className={`px-4 py-3 border-b flex flex-wrap justify-between items-center gap-3 ${
            isDarkMode ? 'bg-[#131722]/50 border-[#2A2E39]' : 'bg-[#f1f4fb]/70 border-[#c3c5d8]/50'
          }`}
        >
          <div className="flex items-center gap-2">
            <h3 className={`font-body text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-[#131722]'}`}>
              {activeTab === 'volume' && 'Highest Volume Assets'}
              {activeTab === 'gainers' && 'Top Gaining Assets'}
              {activeTab === 'losers' && 'Top Declining Assets'}
              {activeTab === 'marketCap' && 'Top Market Cap Assets'}
            </h3>
          </div>

          {/* Tab buttons */}
          <div
            className={`flex items-center gap-1 p-1 rounded-lg border text-xs ${
              isDarkMode ? 'bg-[#131722] border-[#2A2E39]' : 'bg-white border-[#c3c5d8]/40'
            }`}
          >
            <button
              onClick={() => setActiveTab('volume')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                activeTab === 'volume'
                  ? 'bg-[#2962ff] text-white shadow-xs'
                  : 'text-[#6A6D78] hover:text-[#2962ff]'
              }`}
            >
              Volume
            </button>
            <button
              onClick={() => setActiveTab('gainers')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                activeTab === 'gainers'
                  ? 'bg-[#2962ff] text-white shadow-xs'
                  : 'text-[#6A6D78] hover:text-[#2962ff]'
              }`}
            >
              Gainers
            </button>
            <button
              onClick={() => setActiveTab('losers')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                activeTab === 'losers'
                  ? 'bg-[#2962ff] text-white shadow-xs'
                  : 'text-[#6A6D78] hover:text-[#2962ff]'
              }`}
            >
              Losers
            </button>
          </div>
        </div>

        {/* Search Filter input */}
        <div
          className={`px-4 py-2 border-b flex items-center gap-2 text-xs ${
            isDarkMode ? 'bg-[#1e222d] border-[#2A2E39]' : 'bg-white border-[#c3c5d8]/30'
          }`}
        >
          <Search className="w-3.5 h-3.5 text-[#6A6D78]" />
          <input
            type="text"
            placeholder="Filter symbols in screener table..."
            value={tableSearch}
            onChange={(e) => setTableSearch(e.target.value)}
            className={`w-full bg-transparent border-none focus:outline-none text-xs ${
              isDarkMode ? 'text-white placeholder-[#868993]' : 'text-[#131722] placeholder-[#6A6D78]'
            }`}
          />
          {tableSearch && (
            <button onClick={() => setTableSearch('')} className="text-[#6A6D78] text-[10px]">
              Clear
            </button>
          )}
        </div>

        {/* Scrollable Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[550px]">
            <thead>
              <tr
                className={`border-b text-xs font-body uppercase tracking-wider ${
                  isDarkMode
                    ? 'bg-[#131722] border-[#2A2E39] text-[#868993]'
                    : 'bg-white border-[#c3c5d8]/50 text-[#6A6D78]'
                }`}
              >
                <th className="py-2.5 px-4 font-normal sticky left-0 z-10 bg-inherit">Symbol</th>
                <th className="py-2.5 px-4 font-normal text-right">Price</th>
                <th className="py-2.5 px-4 font-normal text-right">Chg %</th>
                <th className="py-2.5 px-4 font-normal text-right">Volume</th>
                <th className="py-2.5 px-4 font-normal text-center w-10">Save</th>
              </tr>
            </thead>
            <tbody className="font-mono-data text-xs">
              {sortedStocks.map((stock) => {
                const isUp = stock.changePercent >= 0;
                const isSaved = watchlistIds.includes(stock.id);

                return (
                  <tr
                    key={stock.id}
                    onClick={() => onSelectStock(stock)}
                    className={`border-b transition-colors cursor-pointer h-11 group ${
                      isDarkMode
                        ? 'border-[#2A2E39]/50 hover:bg-[#2a2e39]/60'
                        : 'border-[#c3c5d8]/30 hover:bg-[#f1f4fb]'
                    }`}
                  >
                    <td className="py-2 px-4 sticky left-0 bg-inherit z-10">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                            isDarkMode ? 'bg-[#2a2e39] text-white' : 'bg-[#dfe2e9] text-[#131722]'
                          }`}
                        >
                          {stock.logoInitials}
                        </div>
                        <div className="truncate">
                          <span className="font-bold text-[#2962ff] mr-2">{stock.symbol}</span>
                          <span
                            className={`font-body text-xs hidden sm:inline ${
                              isDarkMode ? 'text-[#868993]' : 'text-[#6A6D78]'
                            }`}
                          >
                            {stock.name}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className={`py-2 px-4 text-right font-medium ${isDarkMode ? 'text-white' : 'text-[#131722]'}`}>
                      {stock.price > 1000
                        ? stock.price.toLocaleString('en-US', { minimumFractionDigits: 2 })
                        : stock.price.toFixed(2)}
                    </td>
                    <td
                      className={`py-2 px-4 text-right font-bold ${
                        isUp ? 'text-[#089981]' : 'text-[#F23645]'
                      }`}
                    >
                      {isUp ? '+' : ''}
                      {stock.changePercent.toFixed(2)}%
                    </td>
                    <td className="py-2 px-4 text-right text-[#6A6D78]">{stock.volume}</td>
                    <td
                      className="py-2 px-4 text-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWatchlist(stock.id);
                      }}
                    >
                      <button
                        className="p-1 text-[#6A6D78] hover:text-[#2962ff] transition-colors"
                        title={isSaved ? 'Remove from Watchlist' : 'Add to Watchlist'}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            isSaved ? 'fill-[#2962ff] text-[#2962ff]' : 'text-[#6A6D78]'
                          }`}
                        />
                      </button>
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
