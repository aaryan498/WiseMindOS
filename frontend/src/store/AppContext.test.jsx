import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useApp } from './AppContext';

describe('useApp hook', () => {
  it('throws an error if used outside of AppProvider', () => {
    // Suppress console.error for this expected error test
    const consoleSpy = vi.spyOn(console, 'error');
    consoleSpy.mockImplementation(() => {});

    expect(() => renderHook(() => useApp())).toThrow('useApp must be used within AppProvider');
    
    consoleSpy.mockRestore();
  });
});
