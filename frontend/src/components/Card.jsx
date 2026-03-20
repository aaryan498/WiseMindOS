const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-gray-800 rounded-2xl p-6 shadow-lg ${className}`}>
      {children}
    </div>
  );
};

export default Card;