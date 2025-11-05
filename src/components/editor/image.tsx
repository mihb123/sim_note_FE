import { EditorState } from "@codemirror/state"
import { Decoration, type DecorationSet, EditorView, ViewPlugin, ViewUpdate, WidgetType } from "@codemirror/view"
import { syntaxTree } from '@codemirror/language'

// Basic Widget class that only creates demo content
class ImageWidget extends WidgetType {
  constructor() { super() }
  eq() { return false }

  toDOM(): HTMLElement {
    const wrapper = document.createElement('div')
    wrapper.style.display = 'inline-block'
    wrapper.innerText = `>>>This is a contenteditable Div<<<`
    // The following two lines don't really work. The editor always sets the contenteditable attr to false. One can programmatically overwrite it and edit the div without any problems, however.
    // wrapper.contentEditable = 'true'
    wrapper.setAttribute('contenteditable', 'true')
    const input = document.createElement('input')
    input.value = 'An input elem -- edit me!'
    wrapper.appendChild(input)
    return wrapper
  }

  ignoreEvent(): boolean { return true }
}

// Small render function that uses the syntaxTree to find syntax nodes to replace
function renderWidgets(state: EditorState, visibleRanges: readonly { from: number, to: number }[]): DecorationSet {
  const widgets: any[] = []
  const selections = state.selection.ranges.map(range => [range.from, range.to])
  for (const { from, to } of visibleRanges) {
    syntaxTree(state).iterate({
      from, to,
      enter: (node) => {
        // Only render widgets with no selection overlaps
        const overlaps = selections.filter(([from, to]) => !(to <= node.from || from >= node.to)).length
        if (overlaps > 0) { return }
        // In this example, we only render images.
        if (node.type.name !== 'Image') { return }
        const widget = Decoration.replace({ widget: new ImageWidget(), inclusive: false })
        widgets.push(widget.range(node.from, node.to))
      }
    })
  }
  return Decoration.set(widgets)
}

// This ViewPlugin is basically the decoration example.
export const plugin = ViewPlugin.fromClass(class {
  decorations: DecorationSet
  constructor(view: EditorView) {
    this.decorations = renderWidgets(view.state, view.visibleRanges)
  }
  update(update: ViewUpdate) {
    if (update.docChanged || update.viewportChanged || update.selectionSet) {
      this.decorations = renderWidgets(update.view.state, update.view.visibleRanges)
    }
  }
}, { decorations: view => view.decorations }
)