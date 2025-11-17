import { AddCollaborator, RemoveCollaborator } from "@/api/note.api";
import { Button } from "@/components/ui/button"
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useFocusNote from "@/hooks/useFocusNote";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

export default function ShareNotePopup() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const focusNote = useFocusNote(state => state.focusNote);
  const shared_users = focusNote?.note_shares?.map((u) => {
    return {
      sharedId: u.id,
      name: u.user.name,
      email: u.user.email
    }
  }) || [];
  const [sharedUsers, setSharedUsers] = useState(shared_users);

  useEffect(() => {
    setSharedUsers(shared_users);
  }, [focusNote]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setEmail("");
    AddCollaborator(focusNote!.id, email).then((res) => {   
      const userdata = res.note.note_shares.map((u) => {
        return {
          sharedId: u.id,
          name: u.user.name,
          email: u.user.email
        }
       })
      setSharedUsers(userdata)
    }).finally(() => {
      setLoading(false);
    })
  }

  const handleRemove = (sharedId: string) => {
    RemoveCollaborator(sharedId).then((res) => {
      if (res.status == 'success') {
        setSharedUsers((prev) => {
          return prev.filter((u) => u.sharedId !== sharedId)
        })
      } else {
        alert(res.message)
      }   
    }).catch((e) => {
      throw e;
    })
  }

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Share note</DialogTitle>
        <DialogDescription>
          Add email address to share this note with your collaborators.
        </DialogDescription>
      </DialogHeader>
      <div className="flex items-center gap-2">
        <div className="grid flex-1 gap-2">
          <Label htmlFor="email" className="sr-only">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      <div>
        <h3 className="mt-4 mb-2 font-medium">Shared with:</h3>
        <ul className="list-disc list-inside space-y-2">
          {sharedUsers.length === 0 && (
            <li className="text-sm text-gray-500">No collaborators yet.</li>
          )}
          {sharedUsers.map((user, index) => (
            <li key={index} className="text-sm flex ">
              <span className="text-muted-foreground">{user?.name} ({user?.email})</span>
              <X className="inline-block ml-2 cursor-pointer text-red-500 ml-auto" size={16} onClick={() => handleRemove(user.sharedId)}/>
            </li>              
          ))}
        </ul>
      </div>
      <DialogFooter className="sm:justify-end">
        <Button variant="default" onClick={handleSubmit} disabled={loading}>
          {loading ? "Sharing..." : "Share"}
        </Button>
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Close
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}
