import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import useFocusNote from "@/hooks/useFocusNote"
import { Info } from "lucide-react";

export default function NoteInfo() {
  const focusNote = useFocusNote(state => state.focusNote);

  return (
    <Dialog>
      <DialogTrigger asChild className="hover:cursor-pointer">
        <Button variant="ghost" size="icon">
          <Info />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Info</DialogTitle>
          <DialogDescription>
            This is note info.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 text-sm">
          {focusNote &&
            <>
              <div className="flex justify-between">
                <span className="font-medium">Created By:</span>
                <span className="text-muted-foreground">{focusNote?.user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Created At:</span>
                <span className="text-muted-foreground">{new Date(focusNote.created_at).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Last Updated At:</span>
                <span className="text-muted-foreground">{new Date(focusNote.updated_at).toLocaleString()}</span>
              </div>
            </>
          }
          <p className="text-xs text-muted-foreground pt-2">
            * Time format is mm-dd-yyyy
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}