/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Link } from "react-router-dom";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#07144A] text-white mt-auto border-t border-white/10" id="app-footer">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Row 1: Logo, Quick Links, and Helpline */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/10 pb-6 mb-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-5 bg-[#FF6B00] rounded"></span>
              <span className="font-extrabold text-md tracking-wider">BHASKAR</span>
              <span className="text-slate-400 text-xs font-mono">Startup India</span>
            </div>
            <p className="text-[11px] text-slate-400">Empowering innovation and entrepreneurship across India.</p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold text-slate-300">
            <Link to="/" className="hover:text-[#FF6B00] transition-colors">Home</Link>
            <Link to="/about" className="hover:text-[#FF6B00] transition-colors">About Us</Link>
            <Link to="/network" className="hover:text-[#FF6B00] transition-colors">Directory</Link>
            <Link to="/programs" className="hover:text-[#FF6B00] transition-colors">Programs</Link>
            <Link to="/contact" className="hover:text-[#FF6B00] transition-colors">Contact</Link>
          </div>

          {/* Contact & Helpline */}
          <div className="flex flex-col items-center md:items-end gap-1 text-xs">
            <p className="text-slate-400">
              Helpline: <span className="font-mono font-bold text-amber-400">1800-115-565</span>
            </p>
            <p className="text-slate-500 text-[10px]">nodal-desk.bhaskar@nic.in</p>
          </div>
        </div>

        {/* Row 2: Disclaimer & Copyright */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 text-[10px] text-slate-400">
          <p className="text-center lg:text-left max-w-3xl leading-relaxed">
            <span className="font-bold text-slate-300">Disclaimer:</span> BHASKAR Startup India is a digital resource aggregation, networking, and pre-filing facilitation framework. All financial support schemes and approvals are subject to formal verification under national guidelines.
          </p>
          <p className="shrink-0 text-slate-400">
            © {new Date().getFullYear()} BHASKAR. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
