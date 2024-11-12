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
        blue: '#1fb6ff',
        pink: '#ff49db',
        orange: '#ff7849',
        green: '#13ce66',
        'gray-dark': '#273444',
        gray: '#8492a6',
        'gray-light': '#d3dce6',
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
