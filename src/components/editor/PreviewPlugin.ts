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
    Image: (node) => handleImage(builder, state, node),
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
      if (update.docChanged) {
        const changedNodes = new Set<string>();
        
        update.changes.iterChanges((_, __, fromB, toB) => {
          const { state } = update.view;
          syntaxTree(state).iterate({
            from: fromB,
            to: toB,
            enter: (node) => {
              changedNodes.add(node.name);
            },
          });
        })

        const patched = renderPreview(update.view, changedNodes);
        const mapped = this.decorations.map(update.changes);

        const keep: { from: number; to: number; value: Decoration }[] = [];
        mapped.between(0, update.view.state.doc.length, (from, to, value) => {
          const nodeName = (value.spec as any)?.nodeName;
          if (!nodeName || !changedNodes.has(nodeName)) keep.push({ from, to, value });
        });

        const newRanges: { from: number; to: number; value: Decoration }[] = [];
        patched.between(0, update.view.state.doc.length, (from, to, value) => {
          newRanges.push({ from, to, value });
        });

        const merged = [...keep, ...newRanges].sort((a, b) => a.from - b.from);
        this.decorations = Decoration.set(merged);

      } else if (update.viewportChanged || update.selectionSet) {
        this.decorations = renderPreview(update.view);
      }
    }
  },
  {
    decorations: (v) => v.decorations,
  }
);