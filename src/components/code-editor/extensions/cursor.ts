import { EditorView } from '@uiw/react-codemirror';

/**
 * 扩展光标信息
 */

export const defaultCursorInfo = { line: 0, column: 0 };

export interface ICursorInfo {
  line: number;
  column: number;
}

export interface IUseCursorProps {}

export const useCursorListener = (props: IUseCursorProps = {}) => {
  const [cursorInfo, setCursorInfo] = useState<ICursorInfo>(defaultCursorInfo);

  const cursorListenerExt = EditorView.updateListener.of((update) => {
    if (update.selectionSet) {
      const cursorPos = update.state.selection.main.head; // 获取光标绝对位置
      const line = update.state.doc.lineAt(cursorPos); // 根据绝对位置获取所在行信息
      const column = cursorPos - line.from; // 列号计算为行内偏移量
      const cursorInfo: ICursorInfo = { line: line.number, column };
      setCursorInfo(cursorInfo);
    }
  });

  return {
    cursorInfo,
    setCursorInfo,
    cursorListenerExt,
  };
};
