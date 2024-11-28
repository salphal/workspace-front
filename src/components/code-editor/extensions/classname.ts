import { CSSProperties } from 'react';
import { classname } from '@uiw/codemirror-extensions-classname';
import { EditorView } from '@uiw/react-codemirror';

/**
 * 扩展指定行的样式
 * https://uiwjs.github.io/react-codemirror/#/extensions/classname
 */

type lineFunc = (lineNumber: number) => boolean;

export interface IClassNameItem {
  className: string;
  style: CSSProperties;
  line: number | lineFunc;
}

export type ILineStyleList = Array<IClassNameItem>;

export interface IUseClassNameProps {
  lineStyleList?: ILineStyleList;
}

export const useClassName = (props: IUseClassNameProps) => {
  const { lineStyleList } = props;

  const [customTheme, setCustomTheme] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    if (!Array.isArray(lineStyleList) || !lineStyleList.length) return;
    const theme: any = {};
    lineStyleList.forEach((lineStyle) => {
      const { className, style } = lineStyle;
      theme[className] = style;
    });
    setCustomTheme(theme);
  }, [lineStyleList]);

  const lineStyleExt = classname({
    add: (lineNumber) => {
      if (!Array.isArray(lineStyleList) || !lineStyleList.length) return '';
      lineStyleList.forEach((lineStyle) => {
        const { line, className } = lineStyle;
        if (typeof line === 'number') {
          if (lineNumber === line) {
            return className;
          }
        } else if (typeof line === 'function') {
          if (line(lineNumber)) {
            return className;
          }
        }
      });
    },
  });

  return {
    customTheme: EditorView.baseTheme(customTheme),
    lineStyleExt,
  };
};
