import { useState } from 'react';
import { useKeyboardShortcuts } from '../utils/useKeyboardShortcuts'; 
import { Outlet, Navigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { useApp } from '../store/AppContext';

const AppLayout = () => {
  const { token } = useApp();
  const [isShortcutModalOpen, setIsShortcutModalOpen] = useState(false);

  // Initialize global hotkey event listeners
  useKeyboardShortcuts(() => setIsShortcutModalOpen((prev) => !prev));

  // Protect all routes inside this layout
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Outlet />

      {/* KEYBOARD SHORTCUTS CHEAT-SHEET MODAL */}
      {isShortcutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-neutral-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl relative">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                ⌨️ Keyboard Shortcuts
              </h3>
              <button 
                onClick={() => setIsShortcutModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors text-sm px-2 py-1 rounded-md bg-white/5 border border-white/5"
              >
                Esc
              </button>
            </div>

            {/* Shortcut Grid Sections */}
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2">Global Panels</p>
                <div className="flex justify-between items-center py-1 text-sm">
                  <span className="text-gray-300">Toggle Shortcuts Menu</span>
                  <kbd className="px-2 py-0.5 text-xs font-mono bg-white/10 border border-white/20 rounded shadow text-purple-300">?</kbd>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-purple-400 mb-2">Navigation (Press G then...)</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-300">Go to Dashboard</span>
                    <div className="flex gap-1"><kbd className="px-1.5 py-0.5 text-xs bg-white/10 rounded">G</kbd> + <kbd className="px-1.5 py-0.5 text-xs bg-white/10 rounded">D</kbd></div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-300">Go to Goals</span>
                    <div className="flex gap-1"><kbd className="px-1.5 py-0.5 text-xs bg-white/10 rounded">G</kbd> + <kbd className="px-1.5 py-0.5 text-xs bg-white/10 rounded">G</kbd></div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-300">Go to Solo Tasks</span>
                    <div className="flex gap-1"><kbd className="px-1.5 py-0.5 text-xs bg-white/10 rounded">G</kbd> + <kbd className="px-1.5 py-0.5 text-xs bg-white/10 rounded">T</kbd></div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-300">Go to Daily Planner</span>
                    <div className="flex gap-1"><kbd className="px-1.5 py-0.5 text-xs bg-white/10 rounded">G</kbd> + <kbd className="px-1.5 py-0.5 text-xs bg-white/10 rounded">P</kbd></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Tip */}
            <p className="text-center text-xs text-gray-500 mt-5 pt-3 border-t border-white/5">
              Press anywhere outside or hit <kbd className="bg-white/5 px-1 rounded">?</kbd> again to dismiss.
            </p>
          </div>
          {/* Backdrop click closer */}
          <div className="absolute inset-0 -z-10" onClick={() => setIsShortcutModalOpen(false)} />
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default AppLayout;
