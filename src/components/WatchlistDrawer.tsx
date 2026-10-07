import React from 'react';
import { X, Trash2, Star } from 'lucide-react';
import { StockItem } from '../types';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedStocks: StockItem[];
  onRemove: (stockId: string) => void;
  onClear: () => void;
  onSelectStock: (stock: StockItem) => void;
  isDarkMode: boolean;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  savedStocks,
  onRemove,
  onClear,
  onSelectStock,
  isDarkMode,
}) => {
  if (!isOpen) return null;

  const totalValue = savedStocks.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md h-full shadow-2xl border-l flex flex-col animate-in slide-in-from-right duration-250 transition-colors ${
          isDarkMode
            ? 'bg-[#131722] border-[#2A2E39] text-[#d1d4dc]'
            : 'bg-white border-[#c3c5d8] text-[#131722]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          className={`px-5 py-4 border-b flex justify-between items-center ${
            isDarkMode ? 'bg-[#1e222d] border-[#2A2E39]' : 'bg-[#f1f4fb]/70 border-[#c3c5d8]/40'
          }`}
        >
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 fill-[#2962ff] text-[#2962ff]" />
            <h2 className={`font-display font-bold text-lg ${isDarkMode ? 'text-white' : 'text-[#131722]'}`}>
              My Watchlist
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#2962ff] text-white font-mono-data font-bold">
              {savedStocks.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {savedStocks.length > 0 && (
              <button
                onClick={onClear}
                className="text-xs text-[#F23645] hover:underline flex items-center gap-1 font-body"
                title="Clear Watchlist"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-[#2a2e39] text-[#868993]' : 'hover:bg-[#dfe2e9] text-[#6A6D78]'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 font-body">
          {savedStocks.length === 0 ? (
            <div className="p-10 text-center space-y-3">
              <Star className="w-10 h-10 text-[#c3c5d8] mx-auto opacity-70" />
              <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-[#131722]'}`}>
                Your watchlist is empty
              </p>
              <p className="text-xs text-[#6A6D78]">
                Click the star icon next to any stock or index to add it to your personal watchlist.
              </p>
            </div>
          ) : (
            savedStocks.map((stock) => {
              const isUp = stock.changePercent >= 0;

              return (
                <div
                  key={stock.id}
                  onClick={() => {
                    onSelectStock(stock);
                    onClose();
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex justify-between items-center group shadow-xs ${
                    isDarkMode
                      ? 'bg-[#1e222d] hover:bg-[#2a2e39] border-[#2A2E39]'
                      : 'bg-[#f1f4fb]/70 hover:bg-[#f1f4fb] border-[#c3c5d8]/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#2962ff]/10 flex items-center justify-center font-bold text-[#2962ff] font-mono-data text-xs border border-[#2962ff]/20">
                      {stock.logoInitials}
                    </div>
                    <div>
                      <div className={`font-bold font-mono-data text-sm ${isDarkMode ? 'text-white' : 'text-[#131722]'}`}>
                        {stock.symbol}
                      </div>
                      <div className="text-xs text-[#6A6D78] truncate max-w-[120px]">
                        {stock.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    <div className="font-mono-data">
                      <div className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-[#131722]'}`}>
                        ${stock.price.toFixed(2)}
                      </div>
                      <div
                        className={`text-xs font-semibold ${
                          isUp ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {isUp ? '+' : ''}
                        {stock.changePercent.toFixed(2)}%
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(stock.id);
                      }}
                      className="p-1.5 text-[#6A6D78] hover:text-[#F23645] transition-colors rounded-md"
                      title="Remove from Watchlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        {savedStocks.length > 0 && (
          <div
            className={`p-4 border-t font-mono-data text-xs space-y-2 ${
              isDarkMode ? 'bg-[#1e222d] border-[#2A2E39]' : 'bg-[#f1f4fb]/80 border-[#c3c5d8]/40'
            }`}
          >
            <div className="flex justify-between text-[#6A6D78]">
              <span>Watchlist Portfolio Value:</span>
              <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-[#131722]'}`}>
                ${totalValue.toFixed(2)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-full bg-[#2962ff] text-white font-body font-semibold py-2.5 rounded-full hover:bg-[#0049db] transition-colors shadow-xs text-sm mt-1"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
