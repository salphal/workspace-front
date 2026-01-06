import { destroyApp, plugin } from 'wujie';
import WujieReact from 'wujie-react';
import React, {
  ForwardRefRenderFunction,
  Ref,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';

import { Spin } from 'antd';

import MicroServiceAppErrorBoundary from './ErrorBoundary';
import styles from './index.module.scss';

type lifecycle = (win: Window) => any;
type loadErrorHandler = (url: string, e: Error) => any;

/**
 * 数据传递
 *    注入: props
 *    获取: window.$wujie?.props
 */

export interface MicroServiceAppProps {
  /** 唯一性用户必须保证 */
  name: string;
  /** 需要渲染的url */
  url: string;
  /** 服务配置对象 */
  apps: Array<any>;
  /** iframe 的宽度 */
  width?: string;
  /** iframe 的高度 */
  height?: string;
  /** 需要渲染的html, 如果用户已有则无需从url请求 */
  html?: string;
  /** 代码替换钩子 */
  replace?: (code: string) => string;
  /** 自定义fetch */
  fetch?: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
  /** 注入给子应用的属性 */
  props?: { [key: string]: any };
  /** 自定义运行iframe的属性 */
  attrs?: { [key: string]: any };
  /** 自定义降级渲染iframe的属性 */
  degradeAttrs?: { [key: string]: any };
  /** 子应用采用fiber模式执行 */
  fiber?: boolean;
  /**
   * 保活模式: true
   *    子应用保活，state 不会丢失
   *    在保活模式下，子应用只会进行一次渲染，页面发生切换时承载子应用dom的 webcomponent 会保留在内存中
   * 单例模式: false
   *    子应用页面如果切走，会调用window.__WUJIE_UNMOUNT销毁子应用当前实例
   */
  alive?: boolean;
  /**
   * 子应用采用降级iframe方案
   * https://wujie-micro.github.io/doc/guide/degrade.html
   *
   ** 默认: 降级的行为由框架判断，当浏览器不支持时自动降级
   */
  degrade?: boolean;
  /** 子应用插件 */
  plugins?: Array<plugin>;
  /** 子应用生命周期 */
  /** 加载子应用前调用 */
  beforeLoad?: lifecycle;
  /** 子应用 mount 之前调用 */
  beforeMount?: lifecycle;
  /** 子应用 mount 之后调用 */
  afterMount?: lifecycle;
  /** 子应用 unmount 之前调用 */
  beforeUnmount?: lifecycle;
  /** 子应用 unmount 之后调用 */
  afterUnmount?: lifecycle;
  /** 保活子应用进入时触发 */
  activated?: lifecycle;
  /** 保活子应用离开时触发 */
  deactivated?: lifecycle;
  /** 子应用加载资源失败后触发 */
  loadError?: loadErrorHandler;

  [key: string]: any;
}

interface MicroServiceAppRef {
  [key: string]: any;
}

type LifeCycle = (win: Window) => any;

const MicroServiceApp: ForwardRefRenderFunction<
  MicroServiceAppRef,
  Omit<MicroServiceAppProps, 'ref'>
> = (props: Omit<MicroServiceAppProps, 'ref'>, ref: Ref<MicroServiceAppRef | HTMLDivElement>) => {
  const {
    name = '',
    url = '',
    width = '100%',
    height = '100%',
    alive = true,
    fetch,
    props: AppProps = {},
    attrs = {},
    replace = (code: string) => code,
    sync = true,
    /**
     * 短路由配置
     *    /example/prod/hello  => {prod}/hello
     *    /example/test/name => {test}/name
     *    /example/prod/debug?id=5&age=10 => {prodId}5&age=10
     */
    prefix = {
      // prod: '/example/prod',
      // test: '/example/test',
      // prodId: '/example/prod/debug?id=',
    },
    fiber = true,
    degrade = false,
    plugins = [],
  } = props;

  const [loading, setLoading] = useState<any>(false);

  // Customize instance values exposed to parent components
  useImperativeHandle(ref, () => ({}));

  useEffect(() => {
    if (name && url) {
      setLoading(true);
    }
    return () => {
      destroyApp(name);
    };
  }, [name, url]);

  /**
   * 添加自定义fetch后，子应用的静态资源请求和采用了 fetch 的接口请求全部会走自定义 fetch
   * 对于需要携带 cookie 的请求，可以采用自定义 fetch 方式实现
   *
   * @param url {string} 请求地址
   * @param options {object} 请求时候携带参数
   */
  const microServiceAppOnFetch = (url: string, options: any) => {
    return window.fetch(url, { ...options, token: 'token' });
  };

  /**
   * 子应用开始加载静态资源前触发
   */
  const beforeLoad: LifeCycle = (win: Window) => {
    props.beforeLoad?.(win);
  };

  /**
   * 子应用渲染（调用window.__WUJIE_MOUNT）前触发
   */
  const beforeMount: LifeCycle = (win: Window) => {
    props.beforeMount?.(win);
  };

  /**
   * 子应用渲染（调用window.__WUJIE_MOUNT）后触发
   */
  const afterMount: LifeCycle = (win: Window) => {
    props.afterMount?.(win);
  };

  /**
   * 子应用卸载（调用window.__WUJIE_UNMOUNT）前触发
   */
  const beforeUnmount: LifeCycle = (win: Window) => {
    props.beforeUnmount?.(win);
  };

  /**
   * 子应用卸载（调用window.__WUJIE_UNMOUNT）后触发
   */
  const afterUnmount: LifeCycle = (win: Window) => {
    props.afterMount?.(win);
  };

  /**
   * 子应用保活模式下，进入时触发
   */
  const activated: LifeCycle = (win: Window) => {
    if (name && url) setLoading(false);
    props.activated?.(win);
  };

  /**
   * 子应用保活模式下，离开时触发
   */
  const deactivated: LifeCycle = (win: Window) => {
    props.deactivated?.(win);
  };

  /**
   * 子应用加载资源失败后触发
   */
  const loadError: loadErrorHandler = (url: string, err: Error) => {
    setLoading(false);
    props.loadError?.(url, err);
  };

  return (
    <div className={styles.microService}>
      {loading && (
        <Spin
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}
      <MicroServiceAppErrorBoundary>
        {name && url && (
          <WujieReact
            name={name}
            url={url}
            loading={document.createElement('span') as any} // 不使用 wujie 自带的 loading
            width={width}
            height={height}
            alive={alive}
            sync={sync}
            props={{ ...AppProps, test: 'microServiceMain' }}
            attrs={attrs}
            fetch={fetch || microServiceAppOnFetch}
            replace={replace} // 运行时处理子应用的代码
            prefix={prefix} // 短路径的能力，当子应用开启路由同步模式后，如果子应用链接过长，可以采用短路径替换的方式缩短同步的链接
            fiber={fiber} // js 的执行模式，由于子应用的执行会阻塞主应用的渲染线程，当设置为true时js采取类似react fiber的模式方式间断执行
            degrade={degrade}
            plugins={plugins} // webpack 中间件配置
            beforeLoad={beforeLoad}
            beforeMount={beforeMount}
            afterMount={afterMount}
            beforeUnmount={beforeUnmount}
            afterUnmount={afterUnmount}
            activated={activated}
            deactivated={deactivated}
            loadError={loadError}
          />
        )}
      </MicroServiceAppErrorBoundary>
    </div>
  );
};

export default React.forwardRef(MicroServiceApp);
