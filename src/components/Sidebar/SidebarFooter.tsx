import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/Toggle_theme/toggle-mode";

export const SidebarFooter = ({ onLogout }: { onLogout: () => void }) => (
  <div className="flex px-3 py-2 bg-sidebar">
    <Button variant="outline" onClick={onLogout} className="hover:cursor-pointer text-sidebar-text hover:text-sidebar-foreground">
      Logout
    </Button>
    <div className="ml-auto flex gap-2">
      <Button variant="outline" className="hover:cursor-pointer p-2">
        <Settings className="settingIcon hover:cursor-pointer" />
      </Button>
      <ModeToggle />
    </div>
  </div>
);