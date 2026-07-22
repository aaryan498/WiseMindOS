import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useKeyboardShortcuts = (toggleModal) => {
  const navigate = useNavigate();

  useEffect(() => {
    let lastKey = '';
    let timer;

    const handleKeyDown = (event) => {
      // CRITICAL GUARD: Do not trigger navigation if the user is typing in a form input element
      const targetTag = document.activeElement.tagName;
      if (
        targetTag === 'INPUT' || 
        targetTag === 'TEXTAREA' || 
        document.activeElement.isContentEditable
      ) {
        return;
      }

      const key = event.key.toLowerCase();

      // Trigger the Cheat-Sheet Modal overlay on pressing '?' (Shift + /)
      if (event.key === '?') {
        event.preventDefault();
        toggleModal();
        return;
      }

      // Sequence tracking for 'G' followed by another routing character
      if (lastKey === 'g') {
        if (key === 'd') {
          event.preventDefault();
          navigate('/');
        } else if (key === 'g') {
          event.preventDefault();
          navigate('/trackers/goals');
        } else if (key === 't') {
          event.preventDefault();
          navigate('/trackers/tasks');
        } else if (key === 'p') {
          event.preventDefault();
          navigate('/trackers/projects');
        }
        lastKey = ''; // Reset sequence tracker
        return;
      }

      // Cache current key press briefly to register combination chains
      if (key === 'g') {
        lastKey = 'g';
        clearTimeout(timer);
        timer = setTimeout(() => {
          lastKey = '';
        }, 1000); // 1-second timeout window to hit the secondary key
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [navigate, toggleModal]);
};
