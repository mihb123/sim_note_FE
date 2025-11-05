import { EditorState, Range, StateField } from "@codemirror/state";
import { Decoration, type DecorationSet, EditorView, ViewUpdate, WidgetType } from "@codemirror/view";
import { tasklist } from "./tasklist";
import { heading } from "./heading";

const modules = [heading, tasklist];

class CodeBlockWidget extends WidgetType {
  content: string;
  from: number;
  to: number;
  nestedView?: EditorView;
  updating = false;

  constructor(content: string, from: number, to: number) {
    super();
    this.content = content;
    this.from = from;
    this.to = to;
  }

  toDOM(view: EditorView) {
    const wrapper = document.createElement('div')
    wrapper.style.display = 'inline-block'
    const textarea = document.createElement('textarea')
    textarea.value = this.content
    wrapper.appendChild(textarea)

    textarea.addEventListener('input', () => {
      view.dispatch({
        changes: {
          from: this.from,
          to: this.from + this.content.length, // Use current content length for 'to'
          insert: textarea.value
        }
      })
      this.content = textarea.value // Update internal content
    })

    return wrapper
  }

  forwardUpdate(update: ViewUpdate, mainView: EditorView): void {
    if (this.updating || !update.docChanged) return;
    this.updating = true;
    const newContent = update.state.doc.toString();
    mainView.dispatch({
      changes: {
        from: this.from,
        to: this.to,
        insert: newContent
      }
    });
    this.updating = false;
  }
  
  destroy() {
    if (this.nestedView) this.nestedView.destroy();
  }

  updateDOM(dom: HTMLElement): boolean {
    if (dom.textContent !== this.content) dom.textContent = this.content;
    return true;
  }

  eq(other: CodeBlockWidget): boolean {
    return this.content === other.content;
  }

  ignoreEvent(): boolean {
    return true;
  }
}


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

    const blockcodeRe = /^```([\w-]+)?\s*$/;
    if (blockcodeRe.test(line.text)) {
      const start = line.to + 1;
      const blockCodeEndRe = /^```$/;
      pos = line.to + 1;
      while (pos <= to) {
        const next = state.doc.lineAt(pos);
        if (blockCodeEndRe.test(next.text)) {
          const end = next.from;
          const content = state.doc.sliceString(start, end);
          pos = next.to + 1;
          decos.push(Decoration.replace({ widget: new CodeBlockWidget(content, start, end), inclusive: false }).range(line.from, next.to));
          break;
        }
        pos = next.to + 1;
      }
      continue;
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