import prettier from 'prettier';

class FormatCode {
  /**
   * 格式化 JavaScript 代码
   * @param code - 待格式化的 JavaScript 代码
   * @returns 格式化后的 JavaScript 代码
   */
  async javascript(code: string): Promise<string> {
    return await prettier.format(code, { parser: 'babel' });
  }

  /**
   * 格式化 TypeScript 代码
   * @param code - 待格式化的 TypeScript 代码
   * @returns 格式化后的 TypeScript 代码
   */
  async typescript(code: string): Promise<string> {
    return await prettier.format(code, { parser: 'typescript' });
  }

  /**
   * 格式化 Python 代码
   * @param code - 待格式化的 Python 代码
   * @returns 格式化后的 Python 代码
   * @remarks
   * Prettier 不原生支持 Python，但可以扩展或使用其他工具（如 `Black`）。
   */
  python(code: string): string {
    throw new Error('Python 格式化需要使用其他工具，如 Black。');
  }

  /**
   * 格式化 Java 代码
   * @param code - 待格式化的 Java 代码
   * @returns 格式化后的 Java 代码
   * @remarks
   * Prettier 不原生支持 Java，但可以扩展或使用其他工具（如 `google-java-format`）。
   */
  java(code: string): string {
    throw new Error('Java 格式化需要使用其他工具，如 google-java-format。');
  }

  /**
   * 格式化 Shell 脚本
   * @param code - 待格式化的 Shell 代码
   * @returns 格式化后的 Shell 代码
   * @remarks
   * Prettier 不原生支持 Shell 脚本，但可以扩展或使用其他工具（如 `shfmt`）。
   */
  shell(code: string): string {
    throw new Error('Shell 脚本格式化需要使用其他工具，如 shfmt。');
  }

  json(code: string): string {
    return '';
  }
}
