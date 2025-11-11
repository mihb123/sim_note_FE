import { Decoration, EditorView, ViewPlugin, ViewUpdate, WidgetType, type DecorationSet } from "@codemirror/view";
import { syntaxTree } from "@codemirror/language";
import { RangeSetBuilder } from "@codemirror/state";
import { EmptyWidget } from "./heading";
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

function renderPreview(view: EditorView): DecorationSet {
  const builder = new RangeSetBuilder<Decoration>();
  const { state } = view;
  const activeLine = state.doc.lineAt(state.selection.main.head);

  for (const { from, to } of view.visibleRanges) {
    syntaxTree(state).iterate({
      from,
      to,
      enter: (node) => {
        // log(node.name)
        if (node.name === "Image") {
          const urlNode = node.node.getChild("URL");
          const altNode = node.node.getChild("ImageDescription");
          if (urlNode) {
            const url = state.doc.sliceString(urlNode.from, urlNode.to);
            const alt = altNode ? state.doc.sliceString(altNode.from, altNode.to) : "";
            builder.add(node.from, node.to, Decoration.replace({ widget: new ImageWidget(url, alt) }));
          }
        }
        // handle bold text
        if (node.name == "StrongEmphasis") {
          const startPrefix = node.from + 2;
          const endSuffix = node.to - 2;
          builder.add(node.from, startPrefix, Decoration.replace({ widget: new EmptyWidget() }));
          builder.add(endSuffix, node.to, Decoration.replace({ widget: new EmptyWidget() }));
        }

        if (node.name == "Emphasis") {
          const startPrefix = node.from + 1;
          const endSuffix = node.to - 1;
          builder.add(node.from, startPrefix, Decoration.replace({ widget: new EmptyWidget() }));
          builder.add(endSuffix, node.to, Decoration.replace({ widget: new EmptyWidget() }));
        }

        if (node.name == "CodeMark") {
          const parent = node.node.parent;
          if (parent && parent.name === "FencedCode" && isNodeOnActiveLine(parent, activeLine)) return;          
          if (parent?.name === "FencedCode") {
            const startPrefix = node.from + 3;
            const endSuffix = node.to - 3;
            builder.add(node.from, startPrefix, Decoration.replace({ widget: new EmptyWidget() }));
            builder.add(endSuffix, node.to, Decoration.replace({ widget: new EmptyWidget() }));
          }
        }

        if (node.name == "CodeText") {
          const parent = node.node.parent;
          if (parent?.name === "FencedCode" && !parent.getChild("CodeInfo")) {
            const firstLine = state.doc.lineAt(node.from);
            if (node.from === firstLine.from)
              builder.add(node.from, node.from, Decoration.widget({ widget: new EmptyWidget("code-info", "&nbsp;") }));
          }
          const codeText = state.doc.sliceString(node.from, node.to);
          const lines = codeText.split("\n");
          let offset = 0;
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const lineFrom = node.from + offset;
            let className = "";
            if (i === 0) className += " start";
            if (i === lines.length - 1) className += " end";
            if (line.length > 0) {
              const lineTo = lineFrom + line.length;              
              className += " code-text";
              builder.add(lineFrom, lineTo, Decoration.mark({ attributes: { class: className } }));
            } else {
              className += " code-text-empty";
              const widget = Decoration.widget({ widget: new EmptyWidget(className, "&nbsp;") });
              builder.add(lineFrom, lineFrom, widget);
            }
            offset += line.length + 1;
          }
        }

        if (node.name == "CodeInfo") {
          builder.add(node.from, node.to, Decoration.mark({ attributes: { class: `code-info` } }));
        }

        if (node.name == "InlineCode") {
          const text = state.doc.sliceString(node.from+1, node.to-1);
          builder.add(node.from, node.to, Decoration.replace({ widget: new EmptyWidget("inline-code", text) }));
        }

        if (node.name == "Blockquote") {
          const text = state.doc.sliceString(node.from, node.to);
          const lines = text.split("\n");
          let offset = 0;
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const lineFrom = node.from + offset;
            const match = line.match(/^(\s*>+\s+)(.*)$/);
            if (match) {
              const markEnd = lineFrom + match[1].length;
              builder.add(lineFrom, markEnd, Decoration.replace({ widget: new EmptyWidget("quote-mark", "&nbsp;") }));
              const contentStart = lineFrom + match[1].length;
              const contentEnd = lineFrom + line.length;
              if (contentStart < contentEnd) {
                builder.add(contentStart, contentEnd, Decoration.mark({ attributes: { class: "blockquote-content" } }));
              }
            }
            offset += line.length + 1;
          }
        }
      },
    });
  }
  return builder.finish();
}

export const imagePlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = renderPreview(view);
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged || update.selectionSet) {
        this.decorations = renderPreview(update.view);
      }
    }
  },
  {
    decorations: (v) => v.decorations,
  }
);