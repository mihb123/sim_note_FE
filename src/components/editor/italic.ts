import { EditorSelection, EditorState, Transaction } from "@codemirror/state";

const toggleItalic = ({ state, dispatch }: { state: EditorState, dispatch: (tr: Transaction) => void }) => {
  const changes = state.changeByRange((range) => {
    const isItalic =
      state.sliceDoc(range.from - 1, range.from) === "*" &&
      state.sliceDoc(range.to, range.to + 1) === "*";

    if (isItalic) {
      // Unwrap
      return {
        changes: [
          { from: range.from - 1, to: range.from },
          { from: range.to, to: range.to + 1 },
        ],
        range: EditorSelection.range(range.from - 1, range.to - 1),
      };
    } else {
      // Wrap
      return {
        changes: [
          { from: range.from, insert: "*" },
          { from: range.to, insert: "*" },
        ],
        range: EditorSelection.range(range.from + 1, range.to + 1),
      };
    }
  });
  dispatch(state.update(changes, { scrollIntoView: true, userEvent: "format.italic" }));
  return true;
};

export default toggleItalic;