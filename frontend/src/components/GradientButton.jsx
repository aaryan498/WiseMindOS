const GradientButton = ({ children, onClick, className = '', type = 'button', disabled = false, ...props }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      className={`relative overflow-hidden
        bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600
        bg-[length:200%_200%]
        text-white font-semibold py-3 px-6 rounded-xl hover:shadow-[0_0_20px_rgba(99,102,241,0.6)]  hover:-translate-y-1 active:scale-95 transition-all duration-300
        shadow-lg cursor-pointer ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default GradientButton;
