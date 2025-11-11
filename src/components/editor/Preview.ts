import { EditorState, Range, StateField } from "@codemirror/state";
import { Decoration, type DecorationSet, EditorView } from "@codemirror/view";
import { tasklist } from "./tasklist";
import { heading } from "./heading";

const modules = [heading, tasklist];

function computeDecos(state: EditorState, from = 0, to = state.doc.length): DecorationSet {
  const decos: Range<Decoration>[] = [];
  let pos = state.doc.lineAt(from).from;

  while (pos <= to) {
    const line = state.doc.lineAt(pos);
    if (line.length === 0) {
      pos = line.to + 1;
      continue;
    }

    for (const { regex, process } of modules) {
      const match = regex.exec(line.text);
      if (match) {
        if (process(match, line, decos)) {
          break;
        }
      }
    }

    pos = line.to + 1;
  }
  return Decoration.set(decos.sort((a, b) => a.from - b.from), true);
}

export const LivePreview = StateField.define({
  create(state) {
    return computeDecos(state);
  },
  update(decos, tr) {
    if (!tr.docChanged) return decos;
    let mapped = decos.map(tr.changes);

    let from = Infinity, to = -Infinity;
    tr.changes.iterChangedRanges((_, __, fB, tB) => {
      from = Math.min(from, fB);
      to = Math.max(to, tB);
    });

    const patched = computeDecos(tr.state, from, to);

    const ranges: { from: number; to: number; value: any }[] = [];
    for (let cursor = patched.iter(); cursor.value != null; cursor.next()) {
      const rFrom = cursor.from, rTo = cursor.to, val = cursor.value;
      if (typeof rFrom !== "number" || typeof rTo !== "number" || rFrom >= rTo) continue;
      ranges.push({ from: rFrom, to: rTo, value: val });
    }

    return mapped.update({
      filter: (fromA, toA) => toA < from || fromA > to,
      add: ranges
    });
  },
  provide: f => EditorView.decorations.from(f)
});