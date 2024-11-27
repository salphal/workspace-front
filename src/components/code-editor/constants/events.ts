import * as events from '@uiw/codemirror-extensions-events';

/**
 * https://uiwjs.github.io/react-codemirror/#/extensions/events
 */

export const scrollExt = events.scroll({
  scroll: (e) => {
    console.log('=> scroll', e);
  },
});

export const domExt = events.dom({
  click: (e) => {
    console.log('=> click', e);
  },
});

export const contentExt = events.content({
  focus: (e) => {
    console.log('=> focus', e);
  },
  blur: (e) => {
    console.log('=> blur', e);
  },
});

export const elementExt = events.element({
  type: 'content',
  props: {
    inputMode: 'none',
  },
});

export const editorEventExtList = [scrollExt, domExt, contentExt, domExt, elementExt];
