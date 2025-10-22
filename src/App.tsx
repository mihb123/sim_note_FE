import Sidebar from "./components/Sidebar/Sidebar";
import NoteContent from "./components/NoteContent";
import "@/styles//App.css";
import { ThemeProvider } from "@/components/Toggle_theme/theme-provider";
import useSidebarStateOpen from "@/hooks/useSidebarStateOpen";
import { Toaster } from "@/components/ui/sonner"
import { SWRConfig } from "swr";

export default function App() {
  const { isOpen } = useSidebarStateOpen();

  return (
    <ThemeProvider>
      <SWRConfig value={{
        revalidateOnFocus: false,
        dedupingInterval: 500
      }}>
      <main className="flex">
        {isOpen && <Sidebar />}
        <NoteContent />
      </main>
      <Toaster />
    </SWRConfig>
    </ThemeProvider>
  );
}