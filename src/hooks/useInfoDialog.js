import { create } from 'zustand';

// Create a global store for our info dialog
// This replaces the need to pass 'showInfoDialog' props everywhere
export const useInfoDialog = create((set) => ({
  isOpen: false,
  title: '',
  content: '',
  showInfo: (title, content) => set({ title, content, isOpen: true }),
  hideInfo: () => set({ isOpen: false, title: '', content: '' }),
}));