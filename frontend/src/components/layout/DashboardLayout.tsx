/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Outlet } from "react-router-dom";

export const DashboardLayout: React.FC = () => {
  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6" id="dashboard-layout">
      {/* Content outlet */}
      <div>
        <Outlet />
      </div>
    </div>
  );
};
