"use client";

import React from "react";
import { Bus, Train, Plane, Car } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full p-6 bg-white transition-colors duration-300">
      
      {/* Dynamic Animated Transport Center Core */}
      <div className="relative flex items-center justify-center w-20 h-20 mb-6">
        
        {/* Soft Outer Pulse Ring */}
        <div className="absolute inset-0 rounded-full bg-blue-50 animate-ping opacity-75" />
        
        {/* Main Spinning Border Tracker */}
        <div className="absolute inset-0 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin" />
        
        {/* Core Shifting Icon Layout Wrapper */}
        <div className="relative z-10 flex items-center justify-center bg-white rounded-full p-3 shadow-sm border border-slate-100">
          <Bus className="w-6 h-6 text-blue-600 animate-pulse" strokeWidth={2.5} />
        </div>
      </div>

      {/* Text Context Indicators */}
      <div className="flex flex-col items-center space-y-2 text-center max-w-sm">
        <h3 className="text-sm font-bold tracking-wide text-slate-800">
          Securing your journey...
        </h3>
        
        {/* Small Horizontal Vehicle Tracking Badges */}
        <div className="flex items-center space-x-3 text-slate-400 pt-1">
          <Car className="w-4 h-4" />
          <span className="text-xs">•</span>
          <Bus className="w-4 h-4 text-blue-500 font-bold" />
          <span className="text-xs">•</span>
          <Train className="w-4 h-4" />
          <span className="text-xs">•</span>
          <Plane className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}