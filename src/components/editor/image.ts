import { Decoration, EditorView, ViewPlugin, ViewUpdate, WidgetType, type DecorationSet } from "@codemirror/view";
import { syntaxTree } from "@codemirror/language";
import { RangeSetBuilder } from "@codemirror/state";

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

function renderPreview(view: EditorView): DecorationSet {
  const builder = new RangeSetBuilder<Decoration>();
  const { state } = view;

  for (const { from, to } of view.visibleRanges) {
    syntaxTree(state).iterate({
      from,
      to,
      enter: (node) => {
        if (node.name === "Image") {
          const urlNode = node.node.getChild("URL");
          const altNode = node.node.getChild("ImageDescription");
          if (urlNode) {
            const url = state.doc.sliceString(urlNode.from, urlNode.to);
            const alt = altNode ? state.doc.sliceString(altNode.from, altNode.to) : "";
            builder.add(node.from, node.to, Decoration.replace({ widget: new ImageWidget(url, alt) }));
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
      if (update.docChanged || update.viewportChanged) {
        this.decorations = renderPreview(update.view);
      }
    }
  },
  {
    decorations: (v) => v.decorations,
  }
);