import { EditorView, ViewPlugin, ViewUpdate } from "@codemirror/view";
import { ChangeSet } from "@codemirror/state";

const changeTrackerPlugin = ViewPlugin.fromClass(class {
  view: EditorView;
  timer: ReturnType<typeof setTimeout> | null;
  pendingChanges: ChangeSet;

  constructor(view: EditorView) {
    this.view = view;
    this.timer = null;
    this.pendingChanges = ChangeSet.empty(view.state.doc.length);
  }

  update(update: ViewUpdate) {
    if (update.docChanged) {
      this.pendingChanges = this.pendingChanges.compose(update.changes);

      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.flushChanges();
      }, 500);
    }
  }

  flushChanges() {
    const changes: any[] = [];
    
    this.pendingChanges.iterChanges((fromA, toA, fromB, toB, inserted) => {
      changes.push({
        fromA,
        toA,
        fromB,
        toB,
        inserted: inserted.toString()
      });
    });

    if (changes.length > 0) {
      console.log("Debounced Payload:", changes);
    }

    this.pendingChanges = ChangeSet.empty(this.view.state.doc.length);
  }

  destroy() {
    if (this.timer) clearTimeout(this.timer);
  }
});

export default changeTrackerPlugin;