// ============================================
// GLOBAL APP STORE - ZUSTAND
// ============================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  // Theme
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;

  // Sidebar
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;

  // Modal State
  modalOpen: boolean;
  modalContent: React.ReactNode | null;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;

  // Confirm Dialog
  confirmDialog: {
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    onCancel?: () => void;
    variant?: 'default' | 'destructive';
  };
  showConfirm: (options: Omit<AppState['confirmDialog'], 'open'>) => void;
  hideConfirm: () => void;

  // Selected Items (for bulk actions)
  selectedItems: string[];
  setSelectedItems: (items: string[]) => void;
  toggleSelectedItem: (id: string) => void;
  clearSelectedItems: () => void;

  // Search
  globalSearch: string;
  setGlobalSearch: (search: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'system',
      setTheme: (theme) => {
        set({ theme });
        // Apply theme to document
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        if (theme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          root.classList.add(systemTheme);
        } else {
          root.classList.add(theme);
        }
      },

      // Sidebar
      sidebarOpen: true,
      sidebarCollapsed: false,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      // Modal
      modalOpen: false,
      modalContent: null,
      openModal: (content) => set({ modalOpen: true, modalContent: content }),
      closeModal: () => set({ modalOpen: false, modalContent: null }),

      // Confirm Dialog
      confirmDialog: {
        open: false,
        title: '',
        description: '',
        onConfirm: () => {},
        variant: 'default',
      },
      showConfirm: (options) => set({ confirmDialog: { ...options, open: true } }),
      hideConfirm: () => set((state) => ({ confirmDialog: { ...state.confirmDialog, open: false } })),

      // Selected Items
      selectedItems: [],
      setSelectedItems: (items) => set({ selectedItems: items }),
      toggleSelectedItem: (id) => {
        const current = get().selectedItems;
        if (current.includes(id)) {
          set({ selectedItems: current.filter((item) => item !== id) });
        } else {
          set({ selectedItems: [...current, id] });
        }
      },
      clearSelectedItems: () => set({ selectedItems: [] }),

      // Search
      globalSearch: '',
      setGlobalSearch: (search) => set({ globalSearch: search }),
    }),
    {
      name: 'pesantren-admin-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);

// Initialize theme on load
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('pesantren-admin-storage');
  if (stored) {
    const { state } = JSON.parse(stored);
    const theme = state?.theme || 'system';
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }
}
