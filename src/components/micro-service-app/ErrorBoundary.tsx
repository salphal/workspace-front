import React, { PureComponent } from 'react';

import { Link } from 'react-router-dom';

import { Button, Result } from 'antd';

interface Props {
  [key: string]: any;

  children?: any;
}

interface State {
  hasError: boolean;
}

// PureComponent is will optimize shouldComponentUpdate hook
export default class MicroServiceAppErrorBoundary extends PureComponent<
  Props,
  State,
  Record<string, never>
> {
  static readonly defaultProps: any = {};

  static readonly propTypes: Props = {};

  state: State = {
    hasError: false,
  };

  constructor(props: any) {
    super(props);
  }

  /**
   * 错误边界: 子组件在 “渲染期间 render()” 发生错误, 则会导致整个组件树被全部卸载
   *
   *
   * 无法捕获的错误:
   *
   *     1. 只能捕获子组件渲染期间的同步错误, 无法捕获自身组件的错误
   *     2. 无法捕获异步错误( eg: 计时器 等 )
   *     3. 无法捕获事件中的错误
   */

  // handle error bound
  // 触发时机: 渲染子组件过程中, 发生错误之后，更新页面之前触发
  static getDerivedStateFromError(err: any) {
    console.log('-> MicroServiceAppErrorBoundary.err: ', err);
    return {
      hasError: true,
    };
  }

  // log error
  // 触发时机: 渲染子组件过程中, 发生错误之后，更新页面之后触发
  componentDidCatch(err: any, info: any) {
    console.log('-> MicroServiceAppErrorBoundary.info: ', err, info);
  }

  render() {
    const { children } = this.props;

    // An error occurred in the descendant component
    if (this.state.hasError) {
      return (
        <Result
          status={404}
          title={'MicroServiceApp Error Boundary'}
          subTitle={'Sorry, something went wrong.'}
          extra={
            <Link to="/">
              <Button type="primary">Back Home</Button>
            </Link>
          }
        />
      );
    }

    return <>{children}</>;
  }
}
