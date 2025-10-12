import { create } from 'zustand';

interface ActiveTab {
  activeTab: tab,
  setActiveTab: (tab: tab) => void,
}
type tab = 'all' | 'search' | 'save';

const useActiveTab = create<ActiveTab>((set) => ({
  activeTab: 'all',
  setActiveTab: (tab: tab) => set({ activeTab: tab }),
}));

export default useActiveTab
