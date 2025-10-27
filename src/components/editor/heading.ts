import { StateField, type EditorState } from "@codemirror/state";
import { Decoration, EditorView, WidgetType } from "@codemirror/view";

class EmptyWidget extends WidgetType {
  toDOM() {
    const span = document.createElement("span");
    return span;
  }
  eq() { return false; }
  ignoreEvent() { return true; }
}

class TaskWidget extends WidgetType {
  readonly checked: boolean;
  readonly pos: number;

  constructor(checked: boolean, pos: number) {
    super();
    this.checked = checked;
    this.pos = pos;
  }

  toDOM(view: EditorView) {
    const wrap = document.createElement("span");
    wrap.className = "cm-task-marker";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = this.checked;
    checkbox.addEventListener("click", () => {
      const line = view.state.doc.lineAt(this.pos);
      const checkmarkPos = line.text.indexOf("[") + 1;
      const from = line.from + checkmarkPos;
      const to = from + 1;
      const insert = this.checked ? " " : "x";
      view.dispatch({ changes: { from, to, insert } });
    });
    wrap.appendChild(checkbox);
    return wrap;
  }
  eq(other: TaskWidget) {
    return other.checked == this.checked && other.pos == this.pos;
  }
  ignoreEvent() { return false; }
}

function computeDecos(state: EditorState, from = 0, to = state.doc.length) {
  const decos = [];
  let pos = state.doc.lineAt(from).from
  const taskRe = /^(-)\s+(\[[ xX]\])\s?(.*)$/;
  const headRe = /^(#{1,6})\s+(.*)$/;
  while (pos <= to) {
    const line = state.doc.lineAt(pos);
    const text = line.text
    let match = headRe.exec(text);
    if (match) {
      if (!match[2] || match[2].trim().length === 0) {
        pos = line.to + 1
        continue
      }

      const level = match[1].length
      const spaceLen = (text.match(/\s+/)?.[0].length || 1)
      const prefixEnd = line.from + match[1].length + spaceLen

      if (prefixEnd > line.to) {
        pos = line.to + 1
        continue;
      }
      decos.push(Decoration.replace({ widget: new EmptyWidget() }).range(line.from, prefixEnd))
      decos.push(Decoration.mark({ attributes: { class: `h${level}` } }).range(prefixEnd, line.to))
    }

    match = taskRe.exec(text);
    if (match?.length != 0 && match) {
      if (!match[2] || match[2].trim().length === 0) {
        pos = line.to + 1
        continue
      }
      const isCheck =  /\[ *[xX] *\]/.test(match[2])
      const prefixEnd = line.from + text.indexOf("]")+1;
      decos.push(Decoration.replace({ widget: new TaskWidget(isCheck, line.from) }).range(line.from, prefixEnd))
    }
    pos = line.to + 1
  }
  return Decoration.set(decos, true)
}

export const headingField = StateField.define({
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