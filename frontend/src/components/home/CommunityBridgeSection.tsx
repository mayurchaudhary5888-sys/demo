/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { Globe, ArrowRight } from "lucide-react";

export const CommunityBridgeSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState(0);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const titleTargets = node.querySelectorAll<HTMLElement>(".community-reveal");
    let played = false;

    const play = () => {
      if (played) return;
      played = true;

      // Reset and animate the elements in the section
      gsap.fromTo(
        titleTargets,
        { autoAlpha: 0, y: 40, filter: "blur(10px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
        }
      );

      // Animate counter for the 742,352 users
      const counter = { val: 0 };
      gsap.to(counter, {
        val: 742352,
        duration: 2.2,
        ease: "power3.out",
        onUpdate: () => {
          setRegisteredUsers(Math.floor(counter.val));
        },
      });

      // Animate background elements (the orange blob and right corner space illustration)
      gsap.fromTo(
        ".bg-blob-left",
        { scale: 0.7, opacity: 0 },
        { scale: 1, opacity: 0.95, duration: 1.6, ease: "back.out(1.5)" }
      );

      gsap.fromTo(
        ".bg-illustration-right",
        { x: 60, y: 60, opacity: 0 },
        { x: 0, y: 0, opacity: 1, duration: 1.6, ease: "power3.out" }
      );
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) play();
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white pt-16 pb-24 sm:pt-24 sm:pb-32"
      id="community-bridge-section"
    >
      {/* Decorative Blur glows in the background */}
      <div className="absolute left-1/4 top-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,107,0,0.08)_0%,rgba(255,255,255,0)_70%)] blur-3xl" />
      <div className="absolute right-1/4 bottom-10 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(7,20,74,0.06)_0%,rgba(255,255,255,0)_70%)] blur-3xl" />

      {/* Left Bottom Orange Pebble Blob */}
      <div
        className="bg-blob-left absolute -left-12 bottom-6 w-44 h-44 bg-gradient-to-tr from-[#FF6B00] to-[#FF8C3D] opacity-85 blur-[1px] z-10 pointer-events-none"
        style={{ borderRadius: "45% 55% 60% 40% / 40% 60% 40% 60%" }}
      />

      {/* Right Bottom Space/Globe Illustration Corner */}
      <div className="bg-illustration-right absolute right-0 bottom-0 pointer-events-none select-none z-10">
        <svg
          className="w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] md:w-[460px] md:h-[460px]"
          viewBox="0 0 500 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Dark blue corner backdrop */}
          <path
            d="M 120 500 C 240 485 370 435 500 290 L 500 500 Z"
            fill="#07144A"
          />

          {/* Planet body (dotted outline and thin solid outline) */}
          <circle
            cx="370"
            cy="310"
            r="60"
            stroke="#94A3B8"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.25"
          />
          <circle
            cx="370"
            cy="310"
            r="52"
            stroke="#CBD5E1"
            strokeWidth="1.5"
            opacity="0.35"
          />

          {/* Planet Grid lines */}
          <path
            d="M 318 310 Q 370 280 422 310"
            stroke="#94A3B8"
            strokeWidth="1"
            opacity="0.3"
          />
          <path
            d="M 318 310 Q 370 340 422 310"
            stroke="#94A3B8"
            strokeWidth="1"
            opacity="0.3"
          />
          <path
            d="M 370 258 Q 350 310 370 362"
            stroke="#94A3B8"
            strokeWidth="1"
            opacity="0.3"
          />
          <path
            d="M 370 258 Q 390 310 370 362"
            stroke="#94A3B8"
            strokeWidth="1"
            opacity="0.3"
          />

          {/* Planet Rings */}
          <ellipse
            cx="370"
            cy="310"
            rx="96"
            ry="18"
            stroke="#E2E8F0"
            strokeWidth="2"
            transform="rotate(-15 370 310)"
            opacity="0.55"
          />
          <ellipse
            cx="370"
            cy="310"
            rx="108"
            ry="24"
            stroke="#CBD5E1"
            strokeWidth="1"
            strokeDasharray="4 4"
            transform="rotate(-15 370 310)"
            opacity="0.45"
          />

          {/* Background Stars */}
          <g opacity="0.45">
            {/* Star 1 */}
            <path
              d="M 270 210 L 272.5 215.5 L 278 218 L 272.5 220.5 L 270 226 L 267.5 220.5 L 262 218 L 267.5 215.5 Z"
              fill="#94A3B8"
            />
            {/* Star 2 */}
            <path
              d="M 430 190 L 432 194.5 L 436.5 196 L 432 197.5 L 430 202 L 428 197.5 L 423.5 196 L 428 194.5 Z"
              fill="#94A3B8"
            />
            {/* Star 3 */}
            <path
              d="M 300 390 L 301.5 393.5 L 305 395 L 301.5 396.5 L 300 400 L 298.5 396.5 L 295 395 L 298.5 393.5 Z"
              fill="#E2E8F0"
            />
            {/* Star 4 */}
            <path
              d="M 450 340 L 452 344.5 L 456.5 346 L 452 347.5 L 450 352 L 448 347.5 L 443.5 346 L 448 344.5 Z"
              fill="#E2E8F0"
            />
          </g>

          {/* Dotted orbits */}
          <path
            d="M 180 440 C 230 330 310 180 480 130"
            stroke="#E2E8F0"
            strokeWidth="1.5"
            strokeDasharray="6 6"
            opacity="0.3"
          />
          <path
            d="M 210 460 C 270 370 350 230 490 200"
            stroke="#CBD5E1"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.25"
          />

          {/* Cloud/Smoke Trails wrap around bottom right corner */}
          <path
            d="M 410 500 Q 400 440 435 390 T 475 300"
            stroke="#E2E8F0"
            strokeWidth="1.5"
            opacity="0.2"
          />
          <path
            d="M 440 500 Q 430 450 465 410 T 495 330"
            stroke="#CBD5E1"
            strokeWidth="1.2"
            opacity="0.15"
          />

          {/* Small twinkling stars inside the dark blue space block */}
          <circle cx="390" cy="470" r="1.5" fill="white" opacity="0.8" />
          <circle cx="430" cy="440" r="2.5" fill="white" opacity="0.9" />
          <circle cx="460" cy="475" r="1" fill="white" opacity="0.75" />
          <circle cx="475" cy="430" r="2" fill="white" opacity="0.85" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-20">
        {/* Top Centered Section */}
        <div className="community-reveal flex flex-col items-center text-center max-w-4xl mx-auto mb-16 sm:mb-24 space-y-8">
          <p className="text-slate-600 text-base sm:text-lg md:text-xl font-medium leading-relaxed max-w-3xl">
            With the aim to foster collaboration and create impact,{" "}
            <span className="font-extrabold text-[#07144A]">BHASKAR</span>{" "}
            connects entrepreneurs, investors, mentors, policymakers, and other
            startup ecosystem players on a single platform.
          </p>

          <Link
            to="/about-us"
            className="group relative overflow-hidden inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF4B2B] px-8 py-3 text-sm font-bold tracking-wide text-white shadow-[0_12px_30px_rgba(255,107,0,0.3)] transition hover:shadow-[0_16px_35px_rgba(255,107,0,0.45)] active:scale-95 duration-300 cursor-pointer"
          >
            <span className="relative z-10 flex items-center gap-1.5">
              About Us
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF4B2B] to-[#FF6B00] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        </div>

        {/* Middle Two-Column & Bottom Stats Bar Container */}
        <div id="community-details" className="space-y-12">
          {/* Two Columns Layout */}
          <div className="grid gap-6 md:grid-cols-12 md:items-start max-w-6xl mx-auto">
            {/* Left Column: BHASKAR Community */}
            <div className="community-reveal md:col-span-4 lg:col-span-5">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] flex flex-col">
                <span className="text-[#FF6B00]">BHASKAR</span>
                <span className="text-[#07144A] mt-1">Community</span>
              </h2>
            </div>

            {/* Right Column: Description */}
            <div className="community-reveal md:col-span-8 lg:col-span-7">
              <p className="text-slate-600 text-sm sm:text-base md:text-[17px] leading-relaxed font-normal">
                Come and explore the diverse and dynamic innovation ecosystem
                where groundbreaking ideas meet opportunities for growth. BHASKAR
                offers a platform that connects you to a world of collaboration,
                resources, and insights.
              </p>
            </div>
          </div>

          {/* Stats & Browse Bar */}
          <div className="community-reveal max-w-5xl mx-auto pt-4">
            <div className="group relative overflow-hidden rounded-2xl border-2 border-[#FF6B00]/70 bg-white/70 backdrop-blur-md p-4 sm:p-2 sm:pl-8 sm:pr-2 shadow-[0_20px_50px_rgba(7,20,74,0.05)] hover:shadow-[0_24px_60px_rgba(255,107,0,0.1)] transition-all duration-300">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
                {/* Number */}
                <div className="flex-1 flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4">
                  <span className="font-mono text-3xl sm:text-4xl font-extrabold text-[#07144A] tracking-tight">
                    {registeredUsers.toLocaleString("en-IN")}
                  </span>

                  {/* Vertical Divider */}
                  <span className="hidden sm:block h-8 w-px bg-slate-200" />

                  {/* Label */}
                  <span className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider text-center sm:text-left">
                    The No. of Users Registered
                  </span>
                </div>

                {/* Vertical Divider (Desktop) */}
                <span className="hidden sm:block h-8 w-px bg-slate-200 mr-6" />

                {/* Browse Button */}
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent("bsi:open-login"))}
                  className="group/btn relative overflow-hidden inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF4B2B] px-8 py-4 text-sm font-extrabold uppercase tracking-widest text-white shadow-md hover:shadow-lg transition duration-300 w-full sm:w-auto justify-center"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Browse Network
                    <Globe className="h-4.5 w-4.5 transition-transform group-hover/btn:rotate-12" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FF4B2B] to-[#FF6B00] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
