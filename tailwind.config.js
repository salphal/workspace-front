/* eslint-disable */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    theme: {
      screens: {
        sm: '480px',
        md: '768px',
        lg: '976px',
        xl: '1440px',
      },
      colors: {
        blue: '#0d6efd',
        indigo: '#6610f2',
        purple: '#6f42c1',
        pink: '#d63384',
        red: '#dc3545',
        orange: '#fd7e14',
        yellow: '#ffc107',
        green: '#198754',
        teal: '#20c997',
        cyan: '#0dcaf0',
        gray: '#6c757d',
        'gray-dark': '#343a40',
        white: '#fff',
        black: '#000',
      },
      fontFamily: {
        sans: ['Graphik', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      extend: {
        spacing: {
          128: '32rem',
          144: '36rem',
        },
        borderRadius: {
          '4xl': '2rem',
        },
      },
    },
    extend: {},
  },
  /**
   * 有样式冲突, 谨慎引入
   */
  plugins: [
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
    // require('@tailwindcss/aspect-ratio'),
    // require('@tailwindcss/container-queries'),
  ],
  /**
   * 控制 tailwind 生成哪些模块的预设样式
   * https://tailwind.org.cn/docs/configuration
   * @property {Array<string> | Object} corePlugins
   *  - include 数组( 用于启用模块 ): 仅启用包含在数组中的模块
   *  - exclude 对象( 用于排除模块 ): key 为模块, 值为 布尔, false 为关闭
   */
  // 生成预设时排除值为 false 的模块
  corePlugins: {},
  // 仅生成包含在其中的模块
  // corePlugins: [],
};
