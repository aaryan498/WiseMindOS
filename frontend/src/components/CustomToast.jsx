import React from "react";
import logo from "../assets/logo.jpeg";

const CustomToast = ({ message, duration = 4000, status = "default" }) => {
  return (
    <div className="relative flex w-full items-center gap-3 p-4 rounded-2xl 
      backdrop-blur-md bg-white/10 border border-white/20 
      shadow-lg text-black overflow-hidden">

      {/* Avatar */}
      <img
        src={logo}
        alt="WiseMindOS logo"
        className="w-10 h-10 rounded-full object-cover"
      />

      {/* Content */}
      <div>
        <p className="text-white default-bold text-lg">Wise<span className="bg-gradient-to-r from-indigo-500 to-purple-600 baloo-2-700 bg-clip-text text-transparent">Mind</span>OS</p>
        
        <p className={`text-sm default-bold ${status == "success" ? 'text-green-400' : status == "error" ? 'text-red-400' : 'text-gray-400'}`} >{message}</p>
      </div>

      {/* Custom Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white/20">
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