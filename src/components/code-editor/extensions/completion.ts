import { autocompletion, CompletionContext } from '@codemirror/autocomplete'; // 自动补全模块

export interface IUseCompletionProps {}

/**
 * 扩展自定义代码提示
 */

export const useCompletion = (props: IUseCompletionProps = {}) => {
  const completion = (context: CompletionContext) => {
    const word = context.matchBefore(/\w*/); // 匹配当前输入的单词
    if (!word || (word.from === word.to && !context.explicit)) return null;

    /**
     * 返回自定义的提示项
     */
    return {
      from: word.from,
      to: word.to,
      options: [
        { label: 'customFunction', type: 'function' },
        { label: 'customVariable', type: 'variable' },
      ],
    };
  };

  const completionExt = autocompletion({ override: [completion] });

  return {
    completionExt,
  };
};
