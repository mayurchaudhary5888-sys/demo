/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

export const HowItWorksSection: React.FC = () => {
  return (
    <section
      className="relative overflow-hidden bg-white pt-16 pb-16 sm:pt-24 sm:pb-24"
      id="how-it-works-section"
    >
      <div className="mx-auto max-w-[96rem] px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-normal text-[#07144A]">
            How it Works
          </h2>
        </div>

        {/* Workflow GIF */}
        <div className="flex justify-center">
          <img
            src="/how-it-works.gif"
            alt="How it works animation"
            className="h-auto w-full max-w-[1280px] object-contain"
          />
        </div>
      </div>
    </section>
  );
};
