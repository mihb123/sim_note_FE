import { EditorSelection, EditorState, Transaction } from "@codemirror/state";

const toggleBold = ({ state, dispatch }: { state: EditorState, dispatch: (tr: Transaction) => void }) => {
  const changes = state.changeByRange((range) => {
    const isBold =
      state.sliceDoc(range.from - 2, range.from) === "**" &&
      state.sliceDoc(range.to, range.to + 2) === "**";

    if (isBold) {
      return {
        changes: [
          { from: range.from - 2, to: range.from },
          { from: range.to, to: range.to + 2 },
        ],
        range: EditorSelection.range(range.from - 2, range.to - 2),
      };
    } else {
      return {
        changes: [
          { from: range.from, insert: "**" },
          { from: range.to, insert: "**" },
        ],
        range: EditorSelection.range(range.from + 2, range.to + 2),
      };
    }
  });
  dispatch(state.update(changes, { scrollIntoView: true, userEvent: "format.bold" }));
  return true;
};

export default toggleBold;