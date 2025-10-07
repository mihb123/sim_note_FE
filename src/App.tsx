import Sidebar from "./components/Sidebar/Sidebar";
import NoteContent from "./components/NoteContent";
import "@/styles//App.css";
import { ThemeProvider } from "@/components/Toggle_theme/theme-provider";
import { useUser } from '@/hooks/useUser';

export default function App() {
  useUser();

  return (
    <ThemeProvider>
      <main className="flex">
        <Sidebar />
        <NoteContent />
      </main>
    </ThemeProvider>
  );
}