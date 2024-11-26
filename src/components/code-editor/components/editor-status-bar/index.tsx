import React, { Ref, useEffect, useImperativeHandle, useState } from 'react';
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
  const {} = props;

  const [form] = Form.useForm();

  const [formData, setFormData] = useState<IFormData>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [refreshTableCount, setRefreshTableCount] = useState<number>(0);
  const [pagination, setPagination] = useState<IPagination>(defaultPagination);

  useImperativeHandle(ref, () => ({}));

  useEffect(() => {
    const { currentPage, pageSize } = pagination;
    const params = {
      currentPage,
      pageSize,
    };
    fetchDataSource(params);
  }, [pagination.currentPage, pagination.pageSize, refreshTableCount]);

  const fetchDataSource = async (params: any) => {
    try {
    } catch (err) {
      console.error(err);
    }
  };

  const refreshTable = () => {
    setRefreshTableCount((count) => ++count);
  };

  const formOnValueChange = (changedValues: any, allChangedValues: any) => {
    setFormData(allChangedValues);
  };

  const paginationOnChange = (currentPage: number, pageSize: number) => {
    setPagination((pagination) => ({ ...pagination, currentPage, pageSize }));
  };

  const handleEditorStatusBarEventAspect = (type: string, kwargs: any = {}, ...args: any[]) => {
    const handles: any = {
      confirm: handleEditorStatusBarOnConfirm,
      cancel: handleEditorStatusBarOnCancel,
      reset: handleEditorStatusBarOnReset,
    };
    args = Object.keys(kwargs).length || typeof kwargs !== 'object' ? [kwargs, ...args] : args;
    handles[type] && handles?.[type](...args);
  };

  const handleEditorStatusBarOnConfirm = () => {};

  const handleEditorStatusBarOnCancel = () => {};

  const handleEditorStatusBarOnReset = () => {
    form.resetFields();
    setFormData({});
    setLoading(false);
    setDataSource([]);
    setPagination(defaultPagination);
  };

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
