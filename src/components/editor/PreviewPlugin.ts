import { Decoration, EditorView, ViewPlugin, ViewUpdate, type DecorationSet } from "@codemirror/view";
import { syntaxTree } from "@codemirror/language";
import { RangeSetBuilder } from "@codemirror/state";
import type { SyntaxNodeRef } from "@lezer/common";
import { handleImage, handleStrongEmphasis, handleEmphasis, handleCodeMark, handleCodeText, handleCodeInfo, handleInlineCode, handleBlockquote } from "./previewHandlers";

function renderPreview(view: EditorView, changedNodes?: Set<string>): DecorationSet {
  const builder = new RangeSetBuilder<Decoration>();
  const state = view.state;
  const activeLine = state.doc.lineAt(state.selection.main.head);

  const handlers: Record<string, (node: SyntaxNodeRef) => void> = {
    Image: (node) => handleImage(builder, state, node, activeLine),
    StrongEmphasis: (node) => handleStrongEmphasis(builder, node),
    Emphasis: (node) => handleEmphasis(builder, node),
    CodeMark: (node) => handleCodeMark(builder, activeLine, node),
    CodeText: (node) => handleCodeText(builder, state, node),
    CodeInfo: (node) => handleCodeInfo(builder, node),
    InlineCode: (node) => handleInlineCode(builder, state, node),
    Blockquote: (node) => handleBlockquote(builder, state, node),
  };

  for (const { from, to } of view.visibleRanges) {
    syntaxTree(state).iterate({
      from,
      to,
      enter: (node) => {
        if (node.name == "HTMLBlock") {
          const text = state.doc.sliceString(node.from, node.to);
          log(text)
        }
        const handler = handlers[node.name];
        if (handler) {
          if (!changedNodes || changedNodes.has(node.name)) {
            handler(node);
          }
        }
      },
    });
  }

  return builder.finish();
}

export const PreviewPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = renderPreview(view);
    }

    update(update: ViewUpdate) {
      if (update.viewportChanged || update.selectionSet || update.docChanged) {
        this.decorations = renderPreview(update.view);
      }
    }
  },
  {
    decorations: (v) => v.decorations,
  }
);