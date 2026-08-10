"use client";

import Link from "next/link"; // For React Router use: import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-6 py-12">
      <div className="text-center max-w-lg">
        {/* Large 3D-styled 404 text */}
        <h1 className="text-9xl font-black text-slate-200 select-none tracking-widest relative">
          404
          <span className="absolute inset-0 flex justify-center items-center text-5xl font-bold text-rose-600 animate-bounce">
            Oops!
          </span>
        </h1>

        {/* Message Area */}
        <div className="mt-6">
          <h3 className="text-2xl font-bold text-slate-800 md:text-3xl">
            Page Not Found
          </h3>
          <p className="text-gray-500 mt-3 text-sm md:text-base leading-relaxed">
            Sorry, the page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        {/* Animated divider line */}
        <div className="my-8 flex justify-center">
          <div className="w-24 h-1 bg-gradient-to-r from-rose-500 to-amber-500 rounded-full animate-pulse"></div>
        </div>

        {/* Back to Home Button */}
        <div>
          <Link
            href="/" // For React Router use: to="/"
            className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white font-medium px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg gap-2 group transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {/* Back Arrow Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 transition-transform group-hover:-translate-x-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}