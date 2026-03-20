const ToggleSwitch = ({ checked, onChange, label }) => {
  return (
    <label className="flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div className={`block w-14 h-8 rounded-full transition-colors ${
          checked ? 'bg-gradient-to-r from-indigo-600 to-violet-600' : 'bg-gray-600'
        }`}></div>
        <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
          checked ? 'transform translate-x-6' : ''
        }`}></div>
      </div>
      {label && <span className="ml-3 text-gray-300">{label}</span>}
    </label>
  );
};

export default ToggleSwitch;