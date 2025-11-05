import { Range, type Line } from "@codemirror/state";
import { Decoration, WidgetType } from "@codemirror/view";

class EmptyWidget extends WidgetType {
  toDOM() {
    const span = document.createElement("span");
    return span;
  }
  eq() { return false; }
  ignoreEvent() { return true; }
}

export const heading = {
  regex: /^(#{1,6})\s+(.*)$/,
  process: (match: RegExpExecArray, line: Line, decos: Range<Decoration>[]) => {
    if (!match[2] || match[2].trim().length === 0) {
      return false;
    }

    const level = match[1].length;
    const spaceLen = (line.text.match(/\s+/)?.[0].length || 1);
    const prefixEnd = line.from + match[1].length + spaceLen;

    if (prefixEnd > line.to) {
      return false;
    }
    decos.push(Decoration.replace({ widget: new EmptyWidget() }).range(line.from, prefixEnd));
    decos.push(Decoration.mark({ attributes: { class: `h${level}` } }).range(prefixEnd, line.to));
    return true;
  }
};