import { useEffect, useId } from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 pb-20">

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Box */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="
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
          <h2 id={titleId} className="text-xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            aria-label={`Close ${title}`}
            className="text-gray-400 hover:text-white transition-colors rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
          >
            <span aria-hidden="true">✕</span>
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
