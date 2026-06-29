/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

export const HowItWorksSection: React.FC = () => {
  return (
    <section
      className="relative overflow-hidden bg-white py-6 sm:py-10"
      id="how-it-works-section"
    >
      <div className="mx-auto max-w-[96rem] px-0">
        <div className="flex justify-center px-4 sm:px-6 lg:px-8">
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
