import { Decoration, EditorView, ViewPlugin, ViewUpdate, WidgetType, type DecorationSet } from "@codemirror/view";
import { syntaxTree } from "@codemirror/language";
import { RangeSetBuilder } from "@codemirror/state";

class CodeWidget extends WidgetType {
  readonly code: string;
  readonly lang: string;

  constructor( code: string,  lang: string) {
    super();
    this.code = code;
    this.lang = lang;
  }

  toDOM() {
    const pre = document.createElement("pre");
    const codeElem = document.createElement("code");
    if (this.lang) {
      codeElem.className = `language-${this.lang}`;
    }
    codeElem.textContent = this.code;
    pre.appendChild(codeElem);
    // Assuming a highlighter like Prism.js is loaded; otherwise, this just renders plain code
    return pre;
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
        if (node.name === "FencedCode") {
          const langNode = node.node.getChild("CodeInfo");
          const codeNode = node.node.getChild("CodeText");
          
          if (codeNode) {
            const lang = langNode ? state.doc.sliceString(langNode.from, langNode.to) : "";
            const code = state.doc.sliceString(codeNode.from, codeNode.to);
            log(lang)
            log(code)
            builder.add(node.from, node.to, Decoration.replace({ widget: new CodeWidget(code, lang) }));
          }
        }
      },
    });
  }
  return builder.finish();
}

export const BlockquotePlugin = ViewPlugin.fromClass(
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