import { Decoration, WidgetType } from "@codemirror/view";
import type { SyntaxNodeRef } from "@lezer/common";
import { EmptyWidget } from "./heading";
import type { EditorState, Line, RangeSetBuilder } from "@codemirror/state";

class ImageWidget extends WidgetType {
  readonly url: string;
  readonly alt: string;

  constructor(url: string, alt: string) {
    super();
    this.url = url;
    this.alt = alt;
  }

  eq(other: ImageWidget) {
    return other.url === this.url && other.alt === this.alt;
  }

  toDOM() {
    const container = document.createElement("span");
    container.className = "cm-image-widget";
    const img = document.createElement("img");
    img.src = this.url;
    img.alt = this.alt;
    img.title = this.alt;
    container.appendChild(img);
    return container;
  }

  ignoreEvent() {
    return true;
  }
}

function isNodeOnActiveLine(node: { from: number; to: number }, activeLine: { from: number; to: number }): boolean {
  return activeLine.from <= node.to && activeLine.to >= node.from;
}

function stripDelimiters(builder: RangeSetBuilder<Decoration>, node: SyntaxNodeRef, delimiterLength: number) {
  const startPrefix = node.from + delimiterLength;
  const endSuffix = node.to - delimiterLength;
  builder.add(node.from, startPrefix, Decoration.replace({ widget: new EmptyWidget(), nodeName: node.name }));
  builder.add(endSuffix, node.to, Decoration.replace({ widget: new EmptyWidget(), nodeName: node.name }));
}

function handleImage(builder: RangeSetBuilder<Decoration>, state: EditorState, node: SyntaxNodeRef) {
  const urlNode = node.node.getChild("URL");
  const altNode = node.node.getChild("ImageDescription");
  if (!urlNode) return;

  const url = state.doc.sliceString(urlNode.from, urlNode.to);
  const alt = altNode ? state.doc.sliceString(altNode.from, altNode.to) : "";
  builder.add(node.from, node.to, Decoration.replace({ widget: new ImageWidget(url, alt), nodeName: node.name }));
}

function handleStrongEmphasis(builder: RangeSetBuilder<Decoration>, node: SyntaxNodeRef) {
  stripDelimiters(builder, node, 2);
}

function handleEmphasis(builder: RangeSetBuilder<Decoration>, node: SyntaxNodeRef) {
  stripDelimiters(builder, node, 1);
}

function handleCodeMark(builder: RangeSetBuilder<Decoration>, activeLine: Line, node: SyntaxNodeRef) {
  const parent = node.node.parent;
  if (!parent) return;

  if (parent.name === "FencedCode" && isNodeOnActiveLine(parent, activeLine)) return;

  if (parent.name === "FencedCode") {
    stripDelimiters(builder, node, 3);
  }
}

function handleCodeText(builder: RangeSetBuilder<Decoration>, state: EditorState, node: SyntaxNodeRef) {
  const parent = node.node.parent;
  const codeText = state.doc.sliceString(node.from, node.to);
  const lines = codeText.split("\n");

  if (parent?.name === "FencedCode" && !parent.getChild("CodeInfo")) {
    const firstLine = state.doc.lineAt(node.from);
    if (node.from === firstLine.from) {
      builder.add(node.from, node.from, Decoration.widget({
        widget: new EmptyWidget("code-info", "&nbsp;"), nodeName: node.name,
      }));
    }
  }

  let offset = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineFrom = node.from + offset;
    const lineTo = lineFrom + line.length;

    const classes = [
      line.length == 0 ? "code-text-empty" : "code-text",
      i === 0 ? "start" : "",
      i === lines.length - 1 ? "end" : "",
    ].filter(Boolean).join(" ");

    if (line.length > 0) {
      builder.add(lineFrom, lineTo, Decoration.mark({ attributes: { class: classes }, nodeName: node.name }));
    } else {
      builder.add(lineFrom, lineFrom, Decoration.widget({
        widget: new EmptyWidget(classes, "&nbsp;"), nodeName: node.name
      }));
    }

    offset += line.length + 1;
  }
}

function handleCodeInfo(builder: RangeSetBuilder<Decoration>, node: SyntaxNodeRef) {
  builder.add(node.from, node.to, Decoration.mark({ attributes: { class: "code-info" }, nodeName: node.name }));
}

function handleInlineCode(builder: RangeSetBuilder<Decoration>, state: EditorState, node: SyntaxNodeRef) {
  const text = state.doc.sliceString(node.from + 1, node.to - 1);
  builder.add(node.from, node.to, Decoration.replace({
    widget: new EmptyWidget("inline-code", text), nodeName: node.name
  }));
}

function handleBlockquote(builder: RangeSetBuilder<Decoration>, state: EditorState, node: SyntaxNodeRef) {
  const text = state.doc.sliceString(node.from, node.to);
  const lines = text.split("\n");
  let offset = 0;
  for (const line of lines) {
    const lineFrom = node.from + offset;
    const match = line.match(/^(\s*>+\s+)(.*)$/);
    if (match) {
      const [_, prefix, __] = match;
      const markEnd = lineFrom + prefix.length;
      const contentStart = lineFrom + prefix.length;
      const contentEnd = lineFrom + line.length;

      builder.add(lineFrom, markEnd, Decoration.replace({
        widget: new EmptyWidget("quote-mark", "&nbsp;"), nodeName: node.name
      }));

      if (contentStart < contentEnd) {
        builder.add(contentStart, contentEnd, Decoration.mark({ attributes: { class: "blockquote-content" }, nodeName: node.name }));
      }
    }
    offset += line.length + 1;
  }
}

export { handleImage, handleStrongEmphasis, handleEmphasis, handleCodeMark, handleCodeText, handleCodeInfo, handleInlineCode, handleBlockquote };