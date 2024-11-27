import React, { Ref, useImperativeHandle, useState } from 'react';
import { Form } from 'antd';
import classNames from 'classnames';

import styles from './index.module.scss';

const defaultPagination = {
  currentPage: 1,
  pageSize: 20,
  total: 0,
};

interface IPagination {
  currentPage: number;
  pageSize: number;
  total: number;
}

interface IFormData {}

export interface EditorStatusBarProps {
  children?: any;
}

export interface EditorStatusBarMethods {}

interface EditorStatusBarRef {}

const EditorStatusBar: React.ForwardRefRenderFunction<EditorStatusBarRef, EditorStatusBarProps> = (
  props: EditorStatusBarProps & EditorStatusBarMethods,
  ref: Ref<EditorStatusBarRef | HTMLDivElement>,
) => {
  const { ...restProps } = props;

  const [form] = Form.useForm();

  const [formData, setFormData] = useState<IFormData>({});

  useImperativeHandle(ref, () => ({}));

  return (
    <React.Fragment>
      <div className={classNames([styles['editor-status-bar']])}>
        {props.children}
        props: {JSON.stringify(props)}
        <br />
      </div>
    </React.Fragment>
  );
};

export default React.forwardRef(EditorStatusBar);
