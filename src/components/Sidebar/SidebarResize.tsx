const SidebarResizer = ({ onMouseDown }: { onMouseDown: () => void }) => (
  <div
    className="absolute top-0 right-0 h-full w-2 cursor-col-resize hover:bg-sidebar-border/60"
    onMouseDown={onMouseDown}
  ></div>
);

export default SidebarResizer;