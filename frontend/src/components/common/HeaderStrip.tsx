/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Globe, Phone, Accessibility } from "lucide-react";

export const HeaderStrip: React.FC = () => {
  return (
    <div className="bg-[#0B2A5B] text-white py-1.5 px-4 text-[10px] font-medium" id="header-strip">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4 font-mono">
          <a href="#main-content" className="underline hover:text-amber-300 focus:outline-none flex items-center gap-1 transition-colors">
            <Accessibility className="w-3 h-3" />
            <span>Skip to Main Content</span>
          </a>
          <span className="text-slate-400 hidden sm:inline">|</span>
          <span className="text-slate-300 hidden sm:inline">Government of India Initiative</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-slate-300">
            <Phone className="w-3 h-3 text-amber-400" />
            <span>1800-115-565</span>
          </div>
          <div className="flex items-center gap-1 text-slate-300">
            <Globe className="w-3 h-3 text-amber-400" />
            <span>English</span>
          </div>
        </div>
      </div>
    </div>
  );
};
