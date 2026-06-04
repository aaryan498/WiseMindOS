import React from "react";
import logo from "../assets/logo.jpeg";

const CustomToast = ({ message, duration = 4000, status = "default" }) => {
  return (
    <div className="wm-toast-card relative flex w-full items-center gap-3 p-4 rounded-2xl overflow-hidden">

      {/* Avatar */}
      <img
        src={logo}
        alt="logo"
        className="w-10 h-10 rounded-full object-cover"
      />

      {/* Content */}
      <div>
        <p className="wm-text-primary default-bold text-lg">Wise<span className="bg-gradient-to-r from-indigo-500 to-purple-600 baloo-2-700 bg-clip-text text-transparent">Mind</span>OS</p>
        
        <p className={`text-sm default-bold ${status == "success" ? 'text-green-500' : status == "error" ? 'text-red-500' : 'wm-text-muted'}`} >{message}</p>
      </div>

      {/* Custom Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[var(--wm-border)]">
        <div
          className="h-full bg-gradient-to-r from-green-400 to-blue-500"
          style={{
            animation: `progress ${duration}ms linear forwards`,
          }}
        />
      </div>
    </div>
  );
};

export default CustomToast;
