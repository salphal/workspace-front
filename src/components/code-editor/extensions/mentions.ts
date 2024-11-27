/**
 * 开启后语法提示插件失效
 * https://uiwjs.github.io/react-codemirror/#/extensions/mentions
 */
import { mentions } from '@uiw/codemirror-extensions-mentions';

export interface Mention {
  label: string;
}

export type mentionList = Array<Mention>;

export const mentionList: mentionList = [
  {
    label: '@alphal',
  },
  {
    label: '@beta',
  },
  {
    label: '@omega',
  },
];

export const mentionExt = mentions(mentionList);
