import React from "react";
import { Navigate } from "react-router-dom";

export const PortfolioIndex: React.FC = () => {
  return <Navigate to="/portfolio" replace />;
};
