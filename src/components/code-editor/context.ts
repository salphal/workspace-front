import { Context, createContext } from 'react';
import { BasicSetupOptions } from '@uiw/codemirror-extensions-basic-setup';

import { defaultCursorInfo, ICursorInfo } from '@/components/code-editor/extensions/cursor.ts';

export interface ICodeEditorContext {
  cursorInfo: ICursorInfo;
  options: BasicSetupOptions;
  languageOptions: ISelectOptions;
  themeOptions: ISelectOptions;
}

const initialCodeEditorContext: ICodeEditorContext = {
  cursorInfo: defaultCursorInfo,
  options: {},
  languageOptions: [],
  themeOptions: [],
};

const CodeEditorContext: Context<ICodeEditorContext> =
  createContext<ICodeEditorContext>(initialCodeEditorContext);

export const CodeEditorContextProvider = CodeEditorContext.Provider;

export const CodeEditorContextConsumer = CodeEditorContext.Consumer;

export default CodeEditorContext;
