import { motion } from 'framer-motion';

const ToggleSwitch = ({ checked, onChange, label }) => {
  return (
    <label className="flex items-center cursor-pointer select-none">

      <div className="relative">

        {/* Hidden Input (DO NOT TOUCH LOGIC) */}
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />

        {/* TRACK (Background) */}
        <div
          className={`
            w-14 h-8 rounded-full transition-all duration-300
            ${checked
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]'
              : 'bg-gray-600'
            }
          `}
        />

        {/* THUMB (Bullet) */}
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`
            absolute top-1 left-1 w-6 h-6 rounded-full bg-white
            flex items-center justify-center
            ${checked ? 'translate-x-6' : ''}
          `}
        >
          {/* INNER DOT */}
          <div
            className={`
              w-2 h-2 rounded-full transition-all duration-300
              ${checked ? 'bg-green-500' : 'bg-gray-400'}
            `}
          />
        </motion.div>

        {/* GLOW EFFECT */}
        {checked && (
          <div className="absolute inset-0 rounded-full bg-green-400 opacity-20 blur-md" />
        )}

      </div>

      {/* LABEL */}
      {label && (
        <span className="ml-3 text-sm text-gray-300">
          {label}
        </span>
      )}
    </label>
  );
};

export default ToggleSwitch;