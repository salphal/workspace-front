import { classname } from '@uiw/codemirror-extensions-classname';
import { EditorView } from '@uiw/react-codemirror';

/**
 * https://uiwjs.github.io/react-codemirror/#/extensions/classname
 */

const baseTheme = EditorView.baseTheme({
  '&dark .first-line': { backgroundColor: 'red' },
  '&light .first-line': { backgroundColor: 'red' },
  '&dark .line-color': { backgroundColor: 'blue' },
  '&light .line-color': { backgroundColor: 'blue' },
});

export const classnameExt = classname({
  add: (lineNumber) => {
    if (lineNumber === 1) {
      return 'first-line';
    }
    if (lineNumber === 5) {
      return 'line-color';
    }
  },
});
