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
        <label htmlFor={inputId} className="wm-label block text-sm font-medium mb-2">
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
            wm-input rounded-lg
            px-4 py-3 pr-10
            focus:outline-none
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
            className="absolute right-3 top-4 text-[var(--wm-text-muted)] hover:text-[var(--wm-text)] transition-all duration-300 transform hover:scale-110 active:scale-95 hover:drop-shadow-[0_0_6px_rgba(99,102,241,0.6)] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 rounded"
          >
            {showPassword ? <EyeOff aria-hidden="true" size={18} /> : <Eye aria-hidden="true" size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputField;
