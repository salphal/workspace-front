import { autocompletion, Completion, CompletionContext } from '@codemirror/autocomplete';
import { Extension } from '@codemirror/state';

export function mentions(data: Completion[] = []): Extension {
  return autocompletion({
    override: [
      (context: CompletionContext) => {
        const word = context.matchBefore(/@(\w+)?/);
        if (!word) return null;
        if (word && word.from == word.to && !context.explicit) {
          return null;
        }
        return {
          from: word?.from!,
          options: [...data],
        };
      },
    ],
  });
}

export const mentionsView: Extension = [mentions()];
