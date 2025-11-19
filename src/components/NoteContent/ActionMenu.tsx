import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { EllipsisVertical } from "lucide-react"
import { memo } from "react"

function ActionMenu() {
  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild className="hover:cursor-pointer">
        <Button variant="ghost" size="icon">
          <EllipsisVertical />
          <span className="sr-only">Action menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Copy Internal link</DropdownMenuItem>
        <DropdownMenuItem>Publish</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default memo(ActionMenu)