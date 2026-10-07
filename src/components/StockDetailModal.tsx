import React, { useState } from 'react';
import { StockItem, IndexItem, WorldIndexItem } from '../types';
import {
  X,
  Star,
  Bell,
  TrendingUp,
  ShieldCheck,
  Activity,
  Layers,
  BarChart2,
  LineChart,
  Maximize2,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Sliders,
  DollarSign
} from 'lucide-react';

interface StockDetailModalProps {
  item: StockItem | IndexItem | WorldIndexItem | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleWatchlist: (id: string) => void;
  isDarkMode: boolean;
}

type TimeFrame = '1m' | '5m' | '15m' | '1H' | '1D' | '1W' | '1M' | 'ALL';
type ChartType = 'candlestick' | 'area' | 'line';
type ModalTab = 'chart' | 'technicals' | 'orderbook' | 'financials';

export const StockDetailModal: React.FC<StockDetailModalProps> = ({
  item,
  onClose,
  isSaved,
  onToggleWatchlist,
  isDarkMode,
}) => {
  const [timeframe, setTimeframe] = useState<TimeFrame>('1D');
  const [chartType, setChartType] = useState<ChartType>('candlestick');
  const [activeTab, setActiveTab] = useState<ModalTab>('chart');
  
  // Indicator Toggles
  const [showSMA, setShowSMA] = useState(true);
  const [showEMA, setShowEMA] = useState(true);
  const [showRSI, setShowRSI] = useState(false);
  const [showVolume, setShowVolume] = useState(true);

  // Paper Trade Order Form State
  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
  const [orderQuantity, setOrderQuantity] = useState(10);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Crosshair Hover State
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!item) return null;

  const symbol = item.symbol;
  const name = item.name;
  const price = 'price' in item ? item.price : 'value' in item ? item.value : 0;
  const changePercent = item.changePercent;
  const isUp = changePercent >= 0;

  const stock = item as Partial<StockItem>;
  const openPrice = stock.openPrice || price * 0.99;
  const dayHigh = stock.dayHigh || price * 1.015;
  const dayLow = stock.dayLow || price * 0.985;
  const high52 = stock.high52 || price * 1.25;
  const low52 = stock.low52 || price * 0.75;
  const volume = stock.volume || '45.2M';
  const marketCap = stock.marketCap || '$1.45T';
  const peRatio = stock.peRatio || 32.4;
  const sector = stock.sector || 'Financial Markets';

  // Generate synthetic candles & chart points
  const candleCount = 28;
  const generateCandles = () => {
    const candles = [];
    let current = openPrice;

    for (let i = 0; i < candleCount; i++) {
      const volatility = price * 0.012;
      const change = (Math.sin(i * 0.5) + (Math.random() - 0.48)) * volatility;
      const close = Math.max(0.1, current + change);
      const high = Math.max(current, close) + Math.random() * volatility * 0.6;
      const low = Math.min(current, close) - Math.random() * volatility * 0.6;
      const vol = Math.floor(Math.random() * 500000 + 100000);

      candles.push({
        x: i,
        open: current,
        close: close,
        high: high,
        low: low,
        volume: vol,
        isGreen: close >= current,
      });

      current = close;
    }
    // Set the last candle's close to exact price
    candles[candles.length - 1].close = price;
    return candles;
  };

  const candles = generateCandles();
  const allPrices = candles.flatMap((c) => [c.high, c.low]);
  const minVal = Math.min(...allPrices);
  const maxVal = Math.max(...allPrices);
  const priceRange = maxVal - minVal || 1;

  // Simple Moving Averages calculation
  const smaPoints = candles.map((c, idx) => {
    const slice = candles.slice(Math.max(0, idx - 4), idx + 1);
    const avg = slice.reduce((acc, curr) => acc + curr.close, 0) / slice.length;
    return avg;
  });

  const emaPoints = candles.map((c, idx) => {
    const slice = candles.slice(Math.max(0, idx - 9), idx + 1);
    const avg = slice.reduce((acc, curr) => acc + curr.close, 0) / slice.length;
    return avg;
  });

  const svgWidth = 640;
  const svgHeight = 220;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  };

  const activeCandle = hoverIndex !== null ? candles[hoverIndex] : candles[candles.length - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-4xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[92vh] transition-colors ${
          isDarkMode
            ? 'bg-[#131722] border-[#2A2E39] text-[#d1d4dc]'
            : 'bg-white border-[#c3c5d8] text-[#131722]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toast Alert */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#2962ff] text-white px-4 py-2 rounded-full text-xs font-body shadow-xl z-50 animate-bounce flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Modal Top Bar Header */}
        <div
          className={`px-6 py-3.5 border-b flex justify-between items-center transition-colors ${
            isDarkMode ? 'bg-[#1e222d] border-[#2A2E39]' : 'bg-[#f8f9fd] border-[#c3c5d8]/40'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2962ff] to-[#0049db] text-white font-bold flex items-center justify-center text-sm shadow-md font-mono-data">
              {symbol.slice(0, 3)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg font-bold">{symbol}</h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#2962ff]/10 text-[#2962ff]">
                  PRO TERMINAL
                </span>
                <span className="text-xs text-[#6A6D78] hidden sm:inline">• {sector}</span>
              </div>
              <p className="text-xs text-[#6A6D78] font-body">{name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onToggleWatchlist(item.id);
                showToast(isSaved ? 'Removed from Watchlist' : 'Added to Watchlist!');
              }}
              className={`p-2 rounded-lg border transition-all ${
                isSaved
                  ? 'bg-[#2962ff]/10 border-[#2962ff] text-[#2962ff]'
                  : isDarkMode
                  ? 'bg-[#1e222d] border-[#2A2E39] text-[#868993] hover:text-white'
                  : 'bg-white border-[#c3c5d8]/60 text-[#6A6D78] hover:text-[#131722]'
              }`}
              title="Save to Watchlist"
            >
              <Star className={`w-4 h-4 ${isSaved ? 'fill-[#2962ff]' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? 'hover:bg-[#2a2e39] text-[#868993] hover:text-white'
                  : 'hover:bg-[#dfe2e9] text-[#6A6D78] hover:text-[#131722]'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Secondary Navigation Tabs */}
        <div
          className={`px-6 py-2 border-b flex items-center justify-between font-body text-xs ${
            isDarkMode ? 'bg-[#131722] border-[#2A2E39]' : 'bg-white border-[#c3c5d8]/30'
          }`}
        >
          <div className="flex items-center gap-2">
            {(['chart', 'technicals', 'orderbook', 'financials'] as ModalTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg capitalize font-semibold transition-colors ${
                  activeTab === tab
                    ? 'bg-[#2962ff] text-white shadow-xs'
                    : isDarkMode
                    ? 'text-[#868993] hover:text-white hover:bg-[#1e222d]'
                    : 'text-[#6A6D78] hover:text-[#131722] hover:bg-[#f1f4fb]'
                }`}
              >
                {tab === 'chart' ? 'Interactive Chart' : tab}
              </button>
            ))}
          </div>

          {/* Timeframe Selector Buttons */}
          <div className="hidden sm:flex items-center gap-1 bg-transparent text-[11px] font-mono-data">
            {(['1m', '5m', '15m', '1H', '1D', '1W', '1M', 'ALL'] as TimeFrame[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-1 rounded font-semibold transition-colors ${
                  timeframe === tf
                    ? 'bg-[#2962ff] text-white'
                    : isDarkMode
                    ? 'text-[#868993] hover:text-white'
                    : 'text-[#6A6D78] hover:text-[#131722]'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 font-body">
          {activeTab === 'chart' && (
            <>
              {/* Header Price Details + Telemetry Bar */}
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono-data text-3xl font-black">
                      ${price > 1000 ? price.toLocaleString('en-US', { minimumFractionDigits: 2 }) : price.toFixed(2)}
                    </span>
                    <span
                      className={`font-mono-data text-sm font-bold flex items-center gap-1 ${
                        isUp ? 'text-[#089981]' : 'text-[#F23645]'
                      }`}
                    >
                      {isUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      {isUp ? '+' : ''}
                      {((price * Math.abs(changePercent)) / 100).toFixed(2)} ({isUp ? '+' : ''}
                      {changePercent.toFixed(2)}%)
                    </span>
                  </div>

                  {/* OHLC Telemetry bar on Crosshair Hover */}
                  <div className="flex flex-wrap gap-4 text-xs font-mono-data text-[#6A6D78] mt-1.5">
                    <span>O: <strong className={isDarkMode ? 'text-white' : 'text-[#131722]'}>${activeCandle.open.toFixed(2)}</strong></span>
                    <span>H: <strong className={isDarkMode ? 'text-white' : 'text-[#131722]'}>${activeCandle.high.toFixed(2)}</strong></span>
                    <span>L: <strong className={isDarkMode ? 'text-white' : 'text-[#131722]'}>${activeCandle.low.toFixed(2)}</strong></span>
                    <span>C: <strong className={isDarkMode ? 'text-white' : 'text-[#131722]'}>${activeCandle.close.toFixed(2)}</strong></span>
                    <span>Vol: <strong className={isDarkMode ? 'text-white' : 'text-[#131722]'}>{activeCandle.volume.toLocaleString()}</strong></span>
                  </div>
                </div>

                {/* Chart Customization Controls */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {/* Chart Type Buttons */}
                  <div
                    className={`flex items-center p-1 rounded-lg border ${
                      isDarkMode ? 'bg-[#1e222d] border-[#2A2E39]' : 'bg-[#f1f4fb] border-[#c3c5d8]/40'
                    }`}
                  >
                    <button
                      onClick={() => setChartType('candlestick')}
                      className={`p-1.5 rounded transition-colors ${
                        chartType === 'candlestick'
                          ? 'bg-[#2962ff] text-white'
                          : 'text-[#6A6D78] hover:text-white'
                      }`}
                      title="Candlestick Chart"
                    >
                      <BarChart2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setChartType('line')}
                      className={`p-1.5 rounded transition-colors ${
                        chartType === 'line' ? 'bg-[#2962ff] text-white' : 'text-[#6A6D78] hover:text-white'
                      }`}
                      title="Line Chart"
                    >
                      <LineChart className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Indicator Toggles */}
                  <button
                    onClick={() => setShowSMA(!showSMA)}
                    className={`px-2.5 py-1 rounded-lg font-mono-data font-semibold text-[11px] border transition-colors ${
                      showSMA
                        ? 'bg-[#ff9800]/20 text-[#ff9800] border-[#ff9800]/40'
                        : isDarkMode
                        ? 'bg-[#1e222d] text-[#6A6D78] border-[#2A2E39]'
                        : 'bg-[#f1f4fb] text-[#6A6D78] border-transparent'
                    }`}
                  >
                    SMA (20)
                  </button>
                  <button
                    onClick={() => setShowEMA(!showEMA)}
                    className={`px-2.5 py-1 rounded-lg font-mono-data font-semibold text-[11px] border transition-colors ${
                      showEMA
                        ? 'bg-[#9c27b0]/20 text-[#e14eca] border-[#9c27b0]/40'
                        : isDarkMode
                        ? 'bg-[#1e222d] text-[#6A6D78] border-[#2A2E39]'
                        : 'bg-[#f1f4fb] text-[#6A6D78] border-transparent'
                    }`}
                  >
                    EMA (50)
                  </button>
                  <button
                    onClick={() => setShowRSI(!showRSI)}
                    className={`px-2.5 py-1 rounded-lg font-mono-data font-semibold text-[11px] border transition-colors ${
                      showRSI
                        ? 'bg-[#2962ff]/20 text-[#2962ff] border-[#2962ff]/40'
                        : isDarkMode
                        ? 'bg-[#1e222d] text-[#6A6D78] border-[#2A2E39]'
                        : 'bg-[#f1f4fb] text-[#6A6D78] border-transparent'
                    }`}
                  >
                    RSI (14)
                  </button>
                </div>
              </div>

              {/* Chart Canvas Area with SVG Candlesticks & Technical Overlay */}
              <div
                className={`rounded-2xl p-4 border relative overflow-hidden transition-colors ${
                  isDarkMode ? 'bg-[#0c0e15] border-[#2A2E39]' : 'bg-[#f8f9fd] border-[#c3c5d8]/60'
                }`}
              >
                {/* SVG Candlestick / Line Chart */}
                <svg
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  className="w-full h-56 cursor-crosshair overflow-visible"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const index = Math.min(
                      candleCount - 1,
                      Math.max(0, Math.floor((x / rect.width) * candleCount))
                    );
                    setHoverIndex(index);
                  }}
                  onMouseLeave={() => setHoverIndex(null)}
                >
                  {/* Grid Lines */}
                  {[0.2, 0.4, 0.6, 0.8].map((ratio) => (
                    <line
                      key={ratio}
                      x1="0"
                      y1={svgHeight * ratio}
                      x2={svgWidth}
                      y2={svgHeight * ratio}
                      stroke={isDarkMode ? '#1e222d' : '#e0e4ee'}
                      strokeDasharray="4 4"
                    />
                  ))}

                  {/* Draw Candlesticks */}
                  {chartType === 'candlestick' &&
                    candles.map((c, i) => {
                      const candleWidth = svgWidth / candleCount;
                      const x = i * candleWidth + candleWidth / 2;
                      const yHigh = svgHeight - ((c.high - minVal) / priceRange) * (svgHeight - 40) - 20;
                      const yLow = svgHeight - ((c.low - minVal) / priceRange) * (svgHeight - 40) - 20;
                      const yOpen = svgHeight - ((c.open - minVal) / priceRange) * (svgHeight - 40) - 20;
                      const yClose = svgHeight - ((c.close - minVal) / priceRange) * (svgHeight - 40) - 20;

                      const topBody = Math.min(yOpen, yClose);
                      const heightBody = Math.max(3, Math.abs(yOpen - yClose));
                      const color = c.isGreen ? '#089981' : '#F23645';

                      return (
                        <g key={i}>
                          {/* Wick */}
                          <line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={color} strokeWidth="1.5" />
                          {/* Body */}
                          <rect
                            x={x - candleWidth * 0.35}
                            y={topBody}
                            width={candleWidth * 0.7}
                            height={heightBody}
                            fill={color}
                            rx="1"
                          />

                          {/* Volume Bar at Bottom */}
                          {showVolume && (
                            <rect
                              x={x - candleWidth * 0.35}
                              y={svgHeight - (c.volume / 600000) * 35}
                              width={candleWidth * 0.7}
                              height={(c.volume / 600000) * 35}
                              fill={color}
                              opacity="0.25"
                            />
                          )}
                        </g>
                      );
                    })}

                  {/* Line Chart mode */}
                  {chartType === 'line' && (
                    <polyline
                      fill="none"
                      stroke={isUp ? '#089981' : '#F23645'}
                      strokeWidth="2.5"
                      points={candles
                        .map((c, i) => {
                          const candleWidth = svgWidth / candleCount;
                          const x = i * candleWidth + candleWidth / 2;
                          const y = svgHeight - ((c.close - minVal) / priceRange) * (svgHeight - 40) - 20;
                          return `${x},${y}`;
                        })
                        .join(' ')}
                    />
                  )}

                  {/* SMA (20) Line */}
                  {showSMA && (
                    <polyline
                      fill="none"
                      stroke="#ff9800"
                      strokeWidth="1.8"
                      strokeDasharray="3 3"
                      points={smaPoints
                        .map((val, i) => {
                          const candleWidth = svgWidth / candleCount;
                          const x = i * candleWidth + candleWidth / 2;
                          const y = svgHeight - ((val - minVal) / priceRange) * (svgHeight - 40) - 20;
                          return `${x},${y}`;
                        })
                        .join(' ')}
                    />
                  )}

                  {/* EMA (50) Line */}
                  {showEMA && (
                    <polyline
                      fill="none"
                      stroke="#e14eca"
                      strokeWidth="1.8"
                      points={emaPoints
                        .map((val, i) => {
                          const candleWidth = svgWidth / candleCount;
                          const x = i * candleWidth + candleWidth / 2;
                          const y = svgHeight - ((val - minVal) / priceRange) * (svgHeight - 40) - 20;
                          return `${x},${y}`;
                        })
                        .join(' ')}
                    />
                  )}

                  {/* Active Hover Crosshair Guideline */}
                  {hoverIndex !== null && (
                    <line
                      x1={(hoverIndex * svgWidth) / candleCount + svgWidth / (candleCount * 2)}
                      y1="0"
                      x2={(hoverIndex * svgWidth) / candleCount + svgWidth / (candleCount * 2)}
                      y2={svgHeight}
                      stroke="#2962ff"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                  )}
                </svg>

                {/* Legend indicator key */}
                <div className="flex justify-between items-center text-[10px] font-mono-data text-[#6A6D78] mt-2">
                  <div className="flex gap-3">
                    {showSMA && <span className="text-[#ff9800]">-- SMA 20</span>}
                    {showEMA && <span className="text-[#e14eca]">― EMA 50</span>}
                    <span className="text-[#089981]">■ Bull Volume</span>
                    <span className="text-[#F23645]">■ Bear Volume</span>
                  </div>
                  <span>TradingView Realtime Data feed</span>
                </div>
              </div>

              {/* Pro Technical Rating Meter & Order Execution Ticket */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Technical Sentiment Gauge Meter */}
                <div
                  className={`p-4 rounded-xl border font-body ${
                    isDarkMode ? 'bg-[#1e222d] border-[#2A2E39]' : 'bg-[#f8f9fd] border-[#c3c5d8]/40'
                  }`}
                >
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#6A6D78] mb-3 flex items-center justify-between">
                    <span>Technical Summary</span>
                    <span className="text-[#089981] font-extrabold text-xs">STRONG BUY</span>
                  </h3>

                  {/* Visual Meter Bar */}
                  <div className="space-y-2 font-mono-data text-xs">
                    <div className="flex justify-between text-[11px] text-[#6A6D78]">
                      <span>Strong Sell</span>
                      <span>Neutral</span>
                      <span className="text-[#089981] font-bold">Strong Buy</span>
                    </div>
                    <div className="h-3 rounded-full bg-gradient-to-r from-[#F23645] via-[#ff9800] to-[#089981] relative overflow-hidden">
                      {/* Meter needle marker */}
                      <div className="absolute top-0 bottom-0 left-[85%] w-1.5 bg-white shadow-md rounded-full transform -translate-x-1/2" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-4 text-center text-xs">
                    <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-[#131722]' : 'bg-white'}`}>
                      <div className="text-[10px] text-[#6A6D78]">RSI (14)</div>
                      <div className="font-bold text-[#089981] mt-0.5">64.2 (Buy)</div>
                    </div>
                    <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-[#131722]' : 'bg-white'}`}>
                      <div className="text-[10px] text-[#6A6D78]">MACD (12,26)</div>
                      <div className="font-bold text-[#089981] mt-0.5">+1.45 (Bull)</div>
                    </div>
                    <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-[#131722]' : 'bg-white'}`}>
                      <div className="text-[10px] text-[#6A6D78]">Stochastic</div>
                      <div className="font-bold text-[#089981] mt-0.5">78.0 (Buy)</div>
                    </div>
                  </div>
                </div>

                {/* 2. Instant Paper Trade Execution Ticket */}
                <div
                  className={`p-4 rounded-xl border font-body ${
                    isDarkMode ? 'bg-[#1e222d] border-[#2A2E39]' : 'bg-[#f8f9fd] border-[#c3c5d8]/40'
                  }`}
                >
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#6A6D78] mb-3 flex items-center justify-between">
                    <span>Paper Order Execution</span>
                    <span className="text-xs text-[#2962ff] font-mono-data font-bold">Simulated</span>
                  </h3>

                  <div className="space-y-3 font-body text-xs">
                    {/* Buy/Sell Switcher */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setOrderType('BUY')}
                        className={`py-2 rounded-lg font-bold transition-all ${
                          orderType === 'BUY'
                            ? 'bg-[#089981] text-white shadow-md'
                            : isDarkMode
                            ? 'bg-[#131722] text-[#868993]'
                            : 'bg-white text-[#6A6D78]'
                        }`}
                      >
                        BUY ${price.toFixed(2)}
                      </button>
                      <button
                        onClick={() => setOrderType('SELL')}
                        className={`py-2 rounded-lg font-bold transition-all ${
                          orderType === 'SELL'
                            ? 'bg-[#F23645] text-white shadow-md'
                            : isDarkMode
                            ? 'bg-[#131722] text-[#868993]'
                            : 'bg-white text-[#6A6D78]'
                        }`}
                      >
                        SELL ${price.toFixed(2)}
                      </button>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between">
                      <span className="text-[#6A6D78]">Shares Quantity:</span>
                      <div className="flex items-center gap-2 font-mono-data">
                        <button
                          onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 5))}
                          className={`w-6 h-6 rounded flex items-center justify-center border font-bold ${
                            isDarkMode ? 'bg-[#131722] border-[#2A2E39]' : 'bg-white border-[#c3c5d8]'
                          }`}
                        >
                          -
                        </button>
                        <span className="font-bold text-sm w-10 text-center">{orderQuantity}</span>
                        <button
                          onClick={() => setOrderQuantity(orderQuantity + 5)}
                          className={`w-6 h-6 rounded flex items-center justify-center border font-bold ${
                            isDarkMode ? 'bg-[#131722] border-[#2A2E39]' : 'bg-white border-[#c3c5d8]'
                          }`}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Total Value calculation */}
                    <div className="flex justify-between text-xs pt-1 border-t border-[#2A2E39]/30">
                      <span className="text-[#6A6D78]">Estimated Order Value:</span>
                      <span className="font-mono-data font-bold">${(price * orderQuantity).toFixed(2)}</span>
                    </div>

                    <button
                      onClick={() =>
                        showToast(
                          `Executed ${orderType} ${orderQuantity} shares of ${symbol} at $${price.toFixed(
                            2
                          )}`
                        )
                      }
                      className={`w-full py-2.5 rounded-full font-bold text-white shadow-md transition-all ${
                        orderType === 'BUY'
                          ? 'bg-[#089981] hover:bg-[#07806c]'
                          : 'bg-[#F23645] hover:bg-[#d62837]'
                      }`}
                    >
                      Place Instant {orderType} Order
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'technicals' && (
            <div className="space-y-4 font-body text-xs">
              <h3 className="font-bold text-sm text-[#2962ff]">Pro Technical Oscillators & Moving Averages</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-[#1e222d] border-[#2A2E39]' : 'bg-[#f8f9fd] border-[#c3c5d8]/40'}`}>
                  <h4 className="font-bold mb-2">Oscillators</h4>
                  <ul className="space-y-2 font-mono-data">
                    <li className="flex justify-between"><span>Relative Strength Index (14)</span><strong className="text-[#089981]">64.20 (Buy)</strong></li>
                    <li className="flex justify-between"><span>Stochastic %K (14, 3, 3)</span><strong className="text-[#089981]">78.50 (Buy)</strong></li>
                    <li className="flex justify-between"><span>Commodity Channel Index (20)</span><strong className="text-[#ff9800]">110.2 (Neutral)</strong></li>
                    <li className="flex justify-between"><span>Awesome Oscillator</span><strong className="text-[#089981]">+2.45 (Buy)</strong></li>
                  </ul>
                </div>
                <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-[#1e222d] border-[#2A2E39]' : 'bg-[#f8f9fd] border-[#c3c5d8]/40'}`}>
                  <h4 className="font-bold mb-2">Moving Averages</h4>
                  <ul className="space-y-2 font-mono-data">
                    <li className="flex justify-between"><span>Exponential MA (10)</span><strong className="text-[#089981]">${(price * 0.985).toFixed(2)} (Buy)</strong></li>
                    <li className="flex justify-between"><span>Simple MA (20)</span><strong className="text-[#089981]">${(price * 0.975).toFixed(2)} (Buy)</strong></li>
                    <li className="flex justify-between"><span>Simple MA (50)</span><strong className="text-[#089981]">${(price * 0.940).toFixed(2)} (Buy)</strong></li>
                    <li className="flex justify-between"><span>Simple MA (200)</span><strong className="text-[#089981]">${(price * 0.880).toFixed(2)} (Buy)</strong></li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orderbook' && (
            <div className="space-y-3 font-mono-data text-xs">
              <h3 className="font-bold text-sm text-[#2962ff] font-body">Level 2 Orderbook Depth</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-[#089981] font-bold text-xs border-b pb-1 font-body">Bids (Buy Orders)</div>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex justify-between p-1 rounded bg-[#089981]/10 text-[#089981]">
                      <span>${(price - i * 0.05).toFixed(2)}</span>
                      <span>{(1200 + i * 350).toLocaleString()} qty</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-1">
                  <div className="text-[#F23645] font-bold text-xs border-b pb-1 font-body">Asks (Sell Orders)</div>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex justify-between p-1 rounded bg-[#F23645]/10 text-[#F23645]">
                      <span>${(price + i * 0.05).toFixed(2)}</span>
                      <span>{(950 + i * 420).toLocaleString()} qty</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'financials' && (
            <div className="space-y-4 font-body text-xs">
              <h3 className="font-bold text-sm text-[#2962ff]">Company Financial Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono-data">
                <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-[#1e222d] border-[#2A2E39]' : 'bg-[#f8f9fd]'}`}>
                  <span className="text-[#6A6D78] block text-[10px]">Market Cap</span>
                  <strong className="text-sm font-bold">{marketCap}</strong>
                </div>
                <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-[#1e222d] border-[#2A2E39]' : 'bg-[#f8f9fd]'}`}>
                  <span className="text-[#6A6D78] block text-[10px]">P/E Ratio</span>
                  <strong className="text-sm font-bold">{peRatio}</strong>
                </div>
                <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-[#1e222d] border-[#2A2E39]' : 'bg-[#f8f9fd]'}`}>
                  <span className="text-[#6A6D78] block text-[10px]">Dividend Yield</span>
                  <strong className="text-sm font-bold">1.24%</strong>
                </div>
                <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-[#1e222d] border-[#2A2E39]' : 'bg-[#f8f9fd]'}`}>
                  <span className="text-[#6A6D78] block text-[10px]">EPS (TTM)</span>
                  <strong className="text-sm font-bold">$6.42</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div
          className={`px-6 py-3 border-t flex justify-between items-center text-xs ${
            isDarkMode ? 'bg-[#1e222d] border-[#2A2E39]' : 'bg-[#f8f9fd] border-[#c3c5d8]/40'
          }`}
        >
          <div className="flex items-center gap-2 text-[#6A6D78]">
            <Activity className="w-4 h-4 text-[#089981] animate-pulse" />
            <span>TradingView Pro Feed connected • 5ms latency</span>
          </div>

          <button
            onClick={() => showToast('Order ticket copied to clipboard!')}
            className="bg-[#2962ff] text-white font-semibold px-4 py-1.5 rounded-full hover:bg-[#0049db] transition-colors shadow-sm text-xs"
          >
            Export Chart Telemetry
          </button>
        </div>
      </div>
    </div>
  );
};
