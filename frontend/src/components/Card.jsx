const Card = ({ children, className = '', onClick, onKeyDown, role, tabIndex, ...props }) => {
  const isInteractive = typeof onClick === 'function';

  const handleKeyDown = (event) => {
    onKeyDown?.(event);

    if (!isInteractive || event.defaultPrevented) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick(event);
    }
  };

  return (
    <div
      role={role ?? (isInteractive ? 'button' : undefined)}
      tabIndex={tabIndex ?? (isInteractive ? 0 : undefined)}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={`bg-gray-800 rounded-2xl p-6 shadow-lg ${
        isInteractive ? 'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
