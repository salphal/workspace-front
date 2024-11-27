export const isMac =
  (navigator as any).userAgentData?.platform?.includes('Mac') ||
  /Mac|iPod|iPhone|iPad/.test(navigator.userAgent); // 回退到 userAgent

/**
 * 注意快捷键大小写有区分
 * 注意快捷键大小写有区分
 * 注意快捷键大小写有区分
 */

export class KeyBoard {
  static isMac = isMac;

  // 通用修饰键
  static Ctrl = KeyBoard.isMac ? 'Mod' : 'Ctrl';
  static Alt = 'Alt';
  static Shift = 'Shift';

  // 特殊按键
  static Tab = 'Tab';
  static Esc = 'Escape';
  static Enter = 'Enter';
  static Backspace = 'Backspace';
  static Delete = 'Delete';
  static Space = 'Space';
  static ArrowUp = 'ArrowUp';
  static ArrowDown = 'ArrowDown';
  static ArrowLeft = 'ArrowLeft';
  static ArrowRight = 'ArrowRight';

  /**
   * 获取完整快捷键字符串（支持组合键）
   * @param keys 按键名称数组（如 ['Ctrl', 'Shift', 's']）
   * @returns 拼接的快捷键字符串（如 'Ctrl-Shift-S' 或 'Mod-Shift-s'）
   */
  static combo(keys: string[]): string {
    return keys.join('-');
  }
}

// 保存功能快捷键
export const saveShortcut = KeyBoard.combo([KeyBoard.Ctrl, 's']); // 'Mod-s' 或 'Ctrl-s'

// 插入文本快捷键
export const insertShortcut = KeyBoard.combo([KeyBoard.Ctrl, KeyBoard.Shift, 'i']); // 'Mod-Shift-i' 或 'Ctrl-Shift-i'

// 切换功能快捷键
export const toggleShortcut = KeyBoard.Tab; // 直接使用单键
