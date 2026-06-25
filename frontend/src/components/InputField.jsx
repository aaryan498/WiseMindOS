import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const InputField = ({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const generatedId = useId();

  const isPassword = type === "password";
  const inputId = id ?? props.name ?? `input-${generatedId}`;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-gray-300 text-sm font-medium mb-2">
          {label} {required && <span aria-hidden="true" className="text-red-400">*</span>}
          {required && <span className="sr-only"> required</span>}
        </label>
      )}

      <div className="relative">
        <input
          id={inputId}
          type={isPassword && showPassword ? "text" : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="
            w-full bg-gray-700 text-white border border-gray-600 rounded-lg
            px-4 py-3 pr-10
            focus:outline-none focus:ring-2 focus:ring-indigo-500
            focus:border-transparent
            focus:shadow-[0_0_15px_rgba(99,102,241,0.5)]
            transition-all
          "
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="absolute right-3 top-4 text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110 active:scale-95 hover:drop-shadow-[0_0_6px_rgba(99,102,241,0.6)] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-700 rounded"
          >
            {showPassword ? <EyeOff aria-hidden="true" size={18} /> : <Eye aria-hidden="true" size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputField;
