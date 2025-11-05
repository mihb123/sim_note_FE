import { EditorState, Range, type Line } from "@codemirror/state";
import { Decoration } from "@codemirror/view";
import { WidgetType } from "@codemirror/view";

class CodeBlockWidget extends WidgetType {
  readonly content: string;

  constructor(content: string) {
    super()
    this.content = content;
  }

  toDOM(): HTMLElement {
    const pre = document.createElement("pre");
    pre.textContent = this.content;
    return pre;
  }
}

export const blockcode = {
  regex: /^```([\w-]+)?\s*$/,
  process: (_: RegExpExecArray, line: Line, decos: Range<Decoration>[], state: EditorState, pos: number) => {
    const blockCodeEndRe = /^```$/;
    const start = line.from;
    pos = line.to + 1;
    while (pos <= state.doc.length) {
      const next = state.doc.lineAt(pos);
      if (blockCodeEndRe.test(next.text)) {
        const end = next.to;
        const content = state.doc.sliceString(start, end);
        decos.push(Decoration.replace({ widget: new CodeBlockWidget(content), block: false }).range(start, end));
        pos = next.to + 1;
        break;
      }
      pos = next.to + 1;
    }
    
    return false;
  }
};