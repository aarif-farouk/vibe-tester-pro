import React from 'react';

interface FooterProps {
  isDarkMode: boolean;
}

export const Footer: React.FC<FooterProps> = ({ isDarkMode }) => {
  return (
    <footer
      className={`border-t w-full py-10 mt-16 font-body transition-colors ${
        isDarkMode ? 'bg-[#0c0e15] border-[#2A2E39] text-[#868993]' : 'bg-[#f7f9ff] border-[#c3c5d8]/50 text-[#6A6D78]'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Logo & Brand */}
        <div className={`font-display text-xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-[#131722]'}`}>
          <svg
            fill="none"
            height="24"
            viewBox="0 0 36 28"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
            className="text-[#2962ff]"
          >
            <path
              clipRule="evenodd"
              d="M14 22H9V28H14V22ZM24 22H19V28H24V22ZM24 16H19V22H24V16ZM29 16H34V22H29V16ZM24 10H19V16H24V10ZM29 10H34V16H29V10ZM24 4H19V10H24V4ZM29 4H34V10H29V4ZM14 4H9V10H4V4ZM14 10H9V16H14V10ZM4 10H9V16H4V10Z"
              fill="currentColor"
              fillRule="evenodd"
            ></path>
          </svg>
          TradingView Pro
        </div>

        {/* Links */}
        <nav className="flex flex-wrap justify-center gap-6 text-xs">
          <a href="#" className="hover:text-[#2962ff] transition-colors">
            Markets Telemetry
          </a>
          <a href="#" className="hover:text-[#2962ff] transition-colors">
            Screener & Heatmaps
          </a>
          <a href="#" className="hover:text-[#2962ff] transition-colors">
            Pro Pricing
          </a>
          <a href="#" className="hover:text-[#2962ff] transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-[#2962ff] transition-colors">
            Terms of Service
          </a>
        </nav>

        {/* Copyright */}
        <div className="text-xs">© 2026 TradingView, Inc. All rights reserved.</div>
      </div>
    </footer>
  );
};
