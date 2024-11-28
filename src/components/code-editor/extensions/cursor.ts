import { EditorView } from '@uiw/react-codemirror';

/**
 * 扩展光标信息
 */

export interface ICursorPosition {
  top: number;
  // right: number;
  // bottom: number;
  left: number;
}

export const defaultCursorPosition = {
  top: 0,
  left: 0,
  // right: 0,
  // bottom: 0,
};

export const defaultCursorInfo = { line: 0, column: 0 };

export interface ICursorInfo {
  line: number;
  column: number;
}

export interface IUseCursorProps {}

export const useCursorListener = (props: IUseCursorProps = {}) => {
  const [cursorInfo, setCursorInfo] = useState<ICursorInfo>(defaultCursorInfo);
  const [cursorPosition, setCursorPosition] = useState<ICursorPosition>(defaultCursorPosition);

  const cursorListenerExt = EditorView.updateListener.of((update) => {
    if (update.selectionSet) {
      const cursorPos = update.state.selection.main.head; // 获取光标绝对位置
      const line = update.state.doc.lineAt(cursorPos); // 根据绝对位置获取所在行信息
      const column = cursorPos - line.from; // 列号计算为行内偏移量

      const cursorInfo: ICursorInfo = { line: line.number, column };
      setCursorInfo(cursorInfo);

      const position = update.view.coordsAtPos(cursorPos);
      if (position) {
        const { top, right, bottom, left } = position;
        setCursorPosition({
          top: Math.ceil(top) - 43,
          left: Math.ceil(left) - 200,
          // right: Math.ceil(right),
          // bottom: Math.ceil(bottom),
        });
      }
    }
  });

  return {
    cursorInfo,
    cursorPosition,
    cursorListenerExt,
  };
};
