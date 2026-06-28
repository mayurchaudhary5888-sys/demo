/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

export const DisclaimerSection: React.FC = () => {
  return (
    <section className="bg-white py-12 sm:py-14" id="home-disclaimer-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-black tracking-normal text-slate-800 sm:text-4xl">
          Disclaimer
        </h2>

        <div className="mt-6 space-y-5 text-base leading-8 text-slate-700 sm:text-lg">
          <p>
            Bharat Startup Knowledge Access Registry (BHASKAR) is a new registration process created to enable users to get a BHASKAR ID and generate user profiles to interact with the startup ecosystem. For now, the registration process to get DPIIT recognition and avail services of Startup India will continue in parallel.
          </p>
          <p>
            To maintain accuracy and integrity of the network, only users who have completed their BHASKAR ID generation and created complete user profiles will be visible and searchable on the BHASKAR network section.
          </p>
          <p>
            Startup India, DPIIT or any other government agency are not responsible for any services offered on the platform by users to other users.
          </p>
        </div>
      </div>
    </section>
  );
};
