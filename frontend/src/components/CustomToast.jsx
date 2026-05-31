import React from "react";
import logo from "../assets/logo.jpeg";

const CustomToast = ({ message, duration = 4000, status = "default" }) => {
  
  // Define theme mapping based on status
  const statusStyles = {
    success: {
      text: "text-emerald-400 font-medium",
      progress: "from-emerald-400 to-teal-500",
      border: "border-emerald-500/20"
    },
    error: {
      text: "text-rose-400 font-medium",
      progress: "from-rose-400 to-red-500",
      border: "border-rose-500/20"
    },
    default: {
      text: "text-slate-300 font-medium",
      progress: "from-indigo-500 to-purple-600",
      border: "border-white/10"
    }
  };

  const currentTheme = statusStyles[status] || statusStyles.default;

  return (
    <div 
      role="alert"
      aria-live="polite"
      className={`relative flex w-full max-w-sm items-center gap-3.5 p-4 rounded-2xl backdrop-blur-xl bg-slate-900/70 border shadow-2xl select-none overflow-hidden transition-all duration-300 ${currentTheme.border}`}
    >
      {/* Inline style block injecting the progress keyframe dynamically to support variable duration values smoothly */}
      <style>{`
        @keyframes toastProgress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>

      {/* Avatar Group */}
      <div className="relative shrink-0 flex items-center justify-center">
        <img
          src={logo}
          alt="WiseMindOS Logo"
          className="w-10 h-10 rounded-full object-cover border border-white/10 ring-4 ring-black/20"
        />
        {status !== "default" && (
          <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-slate-900 flex items-center justify-center text-[8px] font-bold text-white shadow-sm ${
            status === "success" ? "bg-emerald-500" : "bg-rose-500"
          }`}>
            {status === "success" ? "✓" : "!"}
          </span>
        )}
      </div>

      {/* Content Text Elements */}
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <h4 className="text-white font-bold text-base tracking-wide leading-tight flex items-center gap-1.5">
          Wise<span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">Mind</span>OS
        </h4>
        <p className={`text-sm tracking-wide leading-relaxed truncate ${currentTheme.text}`}>
          {message}
        </p>
      </div>

      {/* Dynamic Decremental Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 w-full h-3px bg-white/5">
        <div
          className={`h-full bg-gradient-to-r ${currentTheme.progress}`}
          style={{
            animation: `toastProgress ${duration}ms linear forwards`,
          }}
        />
      </div>
    </div>
  );
};

export default CustomToast;