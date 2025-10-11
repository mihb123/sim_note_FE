import { create } from "zustand";

interface SidebarState {
  isOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
}

const useSidebarStateOpen = create<SidebarState>((set) => ({
  isOpen: true,
  openSidebar: () => set({ isOpen: true }),
  closeSidebar: () => set({ isOpen: false }),
}));

export default useSidebarStateOpen;
