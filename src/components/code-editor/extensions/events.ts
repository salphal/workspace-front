import * as events from '@uiw/codemirror-extensions-events';

/**
 * 扩展各种事件
 * https://uiwjs.github.io/react-codemirror/#/extensions/events
 */

export interface IUseEventProps {
  /** 点击事件 */
  onClick?: (e: Event) => void;
  /** 聚焦事件 */
  onFocus?: (e: Event) => void;
  /** 失焦事件 */
  onBlur?: (e: Event) => void;
  /** 滚动事件 */
  onScroll?: (e: Event) => void;
}

export const useEvents = (props: IUseEventProps) => {
  const { onClick, onFocus, onBlur, onScroll } = props;

  const scrollExt = events.scroll({
    scroll: (e) => {
      console.log('=> scroll', e);
      typeof onScroll === 'function' && onScroll(e);
    },
  });

  const domExt = events.dom({
    click: (e) => {
      console.log('=> click', e);
      typeof onClick === 'function' && onClick(e);
    },
  });

  const contentExt = events.content({
    focus: (e) => {
      console.log('=> focus', e);
      typeof onFocus === 'function' && onFocus(e);
    },
    blur: (e) => {
      console.log('=> blur', e);
      typeof onBlur === 'function' && onBlur(e);
    },
  });

  const elementExt = events.element({
    type: 'content',
    props: {
      inputMode: 'none',
    },
  });

  const editorEventListExt = [scrollExt, domExt, contentExt, domExt, elementExt];

  return {
    editorEventListExt,
  };
};
