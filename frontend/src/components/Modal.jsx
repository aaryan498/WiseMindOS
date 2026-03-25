const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 pb-20">

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="
        relative
        bg-white/5 backdrop-blur-xl border border-white/10
        rounded-2xl
        max-w-md w-full
        max-h-[calc(100vh-100px)]
        flex flex-col
        shadow-2xl
      ">

        {/* Header */}
        <div className="flex justify-between items-center p-6 pb-3 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>

      </div>
    </div>
  );
};

export default Modal;