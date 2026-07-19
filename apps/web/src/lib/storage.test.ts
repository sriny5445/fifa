import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getSavedLanguage,
  saveLanguage,
  getSavedTab,
  saveTab,
  getSavedLayout,
  saveLayout,
  getSavedShiftActive,
  saveShiftActive
} from './storage';

// Mock localStorage and sessionStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    })
  };
})();

const sessionStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    })
  };
})();

describe('Storage Helpers', () => {
  beforeEach(() => {
    vi.stubGlobal('window', {});
    vi.stubGlobal('localStorage', localStorageMock);
    vi.stubGlobal('sessionStorage', sessionStorageMock);
    localStorageMock.clear();
    sessionStorageMock.clear();
    vi.clearAllMocks();
  });

  it('should save and retrieve language', () => {
    expect(getSavedLanguage()).toBe('en'); // Default fallback
    saveLanguage('es');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('fifa_lang', 'es');
    expect(getSavedLanguage()).toBe('es');
  });

  it('should save and retrieve active tab', () => {
    expect(getSavedTab()).toBe('mission_control'); // Default fallback
    saveTab('off_ramp');
    expect(sessionStorageMock.setItem).toHaveBeenCalledWith('fifa_active_tab', 'off_ramp');
    expect(getSavedTab()).toBe('off_ramp');
  });

  it('should save and retrieve layout mode', () => {
    expect(getSavedLayout()).toBe('grid'); // Default fallback
    saveLayout('list');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('fifa_layout', 'list');
    expect(getSavedLayout()).toBe('list');
  });

  it('should save and retrieve shift active state', () => {
    expect(getSavedShiftActive()).toBe(false); // Default fallback
    saveShiftActive(true);
    expect(sessionStorageMock.setItem).toHaveBeenCalledWith('fifa_shift_active', 'true');
    expect(getSavedShiftActive()).toBe(true);

    saveShiftActive(false);
    expect(sessionStorageMock.setItem).toHaveBeenCalledWith('fifa_shift_active', 'false');
    expect(getSavedShiftActive()).toBe(false);
  });
});
