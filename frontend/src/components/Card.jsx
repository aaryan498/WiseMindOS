const Card = ({ children, className = '', onClick, role, tabIndex, ...rest }) => {
  const props = {
    onClick,
    role,
    tabIndex,
    ...rest,
  };

  return (
    <div {...props} className={`bg-gray-800 rounded-2xl p-6 shadow-lg ${className}`}>
      {children}
    </div>
  );
};

export default Card;