import { EditorView, ViewPlugin, ViewUpdate, type PluginValue } from "@codemirror/view";
import { ChangeSet, type Extension } from "@codemirror/state";
import { collab, receiveUpdates, sendableUpdates, getSyncedVersion } from "@codemirror/collab";
import type { NoteMetaData } from "@/types";
import { echo } from "@/api/api";
import { PushChanges, PullChanges } from "@/api/note.api";

class CollabBridge implements PluginValue {
public pushing = false;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private channel;
  private view: EditorView;
  private note: NoteMetaData | null;

  constructor(view: EditorView, note: NoteMetaData | null) {
    this.view = view;
    this.note = note;
    this.channel = echo.private('update.note.' + this.note?.id);
    this.pullChanges();
    this.listenSync();
  }

  listenSync() {
    this.channel.listen('PrivateMessage', (data: any) => {
      const updates = JSON.parse(data.updates);
      const confirmedUpdates = updates.map(this.applyChange);
      this.view.dispatch(receiveUpdates(this.view.state, confirmedUpdates));
    });
  }

  update(update: ViewUpdate) {
    if (update.docChanged) {
      if (this.timer) clearTimeout(this.timer);

      this.timer = setTimeout(() => {
        this.pushChanges();
      }, 500);
    }
  }

  async pullChanges() {
		console.log(this.note?.latest_version?.version)
    let version = getSyncedVersion(this.view.state);
		if(this.note?.latest_version?.version != undefined) version = parseInt(this.note?.latest_version?.version);

		log(version)
    const noteId = this.note?.id;
    if (!noteId) return;
    const res = await PullChanges(noteId, version);
    const allUpdates = (res || []).flatMap((record: any) => {
      const parsedChanges = JSON.parse(record.changes);
      const changesArray = Array.isArray(parsedChanges) ? parsedChanges : [parsedChanges];

      return changesArray.map((change: any) => ({
        changes: change,
        clientID: record.clientID
      }));
    });
    const confirmedUpdates = allUpdates.map(this.applyChange);
    this.view.dispatch(receiveUpdates(this.view.state, confirmedUpdates));
  }

  async pushChanges() {
    if (this.pushing || !this.note) return;
    const focusNoteId = this.note.id;
    const updates = sendableUpdates(this.view.state);

    if (updates.length > 0) {
      const clientID = updates[0].clientID;
      const serializedUpdates = updates.map(u => u.changes.toJSON());

      this.pushing = true;
      const version = getSyncedVersion(this.view.state);
      const data = {
        version,
        clientID,
        updates: JSON.stringify(serializedUpdates),
      };
      const res = await PushChanges(focusNoteId, data);
			log(res)
      if (res.status === 'success') {
        this.pushing = false;
        this.view.dispatch(receiveUpdates(this.view.state, updates));
      }
    }
  }

	applyChange = (u: any) => ({
		changes: ChangeSet.fromJSON(u.changes || u),
		clientID: u.clientID,
	});

  destroy() {
    if (this.timer) {
      clearTimeout(this.timer);
      echo.leave('update.note.' + this.note?.id);
    }
  }
}

const workerCollabBridge = (note: NoteMetaData | null) =>
  ViewPlugin.define((view) => new CollabBridge(view, note));

export const useCollabExtension = (note: NoteMetaData | null): Extension => {
  const startVersion = parseInt(note?.latest_version?.version ?? "0", 10) || 0;
  return [collab({ startVersion }), workerCollabBridge(note)];
};