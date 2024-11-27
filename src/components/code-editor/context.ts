import { Context, createContext } from 'react';
import { BasicSetupOptions } from '@uiw/codemirror-extensions-basic-setup';

import { ISettings } from '@/components/code-editor/components/editor-controller';
import { defaultCursorInfo, ICursorInfo } from '@/components/code-editor/extensions/cursor.ts';
import { ISelectOptions } from '@/components/code-editor/typings';

export interface ICodeEditorContext {
  cursorInfo: ICursorInfo;
  options: BasicSetupOptions;
  settings: ISettings;
  languageOptions: ISelectOptions;
  themeOptions: ISelectOptions;
}

const initialCodeEditorContext: ICodeEditorContext = {
  cursorInfo: defaultCursorInfo,
  options: {},
  settings: {},
  languageOptions: [],
  themeOptions: [],
};

const CodeEditorContext: Context<ICodeEditorContext> =
  createContext<ICodeEditorContext>(initialCodeEditorContext);

export const CodeEditorContextProvider = CodeEditorContext.Provider;

export const CodeEditorContextConsumer = CodeEditorContext.Consumer;

export default CodeEditorContext;
