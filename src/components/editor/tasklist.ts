import type { Line, Range } from "@codemirror/state";
import { Decoration, EditorView, WidgetType } from "@codemirror/view";

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
  ignoreEvent() { return true; }
}

export const tasklist = {
  regex: /^\s*(-)\s+(\[[ xX]\])\s+(.*)$/,
  process: (match: RegExpExecArray, line: Line, decos: Range<Decoration>[]) => {
    const isCheck = /\[ *[xX] *\]/.test(match[2]);
    const prefixEnd = line.from + line.text.indexOf("]") + 1;
    decos.push(Decoration.replace({ widget: new TaskWidget(isCheck, line.from) }).range(line.from, prefixEnd));
    return true;
  }
};