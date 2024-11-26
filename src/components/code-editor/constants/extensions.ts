import { javascript } from '@codemirror/lang-javascript';
import { Extension } from '@uiw/react-codemirror';

/**
 * https://codemirror.net/docs/ref/#state.Extension
 */

export const defaultEditorExtensions: Extension[] = [javascript({ jsx: true })];
