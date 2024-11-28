import React, { Ref, useImperativeHandle, useState } from 'react';
import { Form } from 'antd';
import classNames from 'classnames';

import styles from './index.module.scss';
import { useKeyDown } from '@/components/code-editor/components/quick-operation-modal/hooks/key-down.ts';

interface IFormData {}

export interface QuickOperationModalProps {
  children?: any;
}

export interface QuickOperationModalMethods {}

interface QuickOperationModalRef {}

const QuickOperationModal: React.ForwardRefRenderFunction<
  QuickOperationModalRef,
  QuickOperationModalProps
> = (
  props: QuickOperationModalProps & QuickOperationModalMethods,
  ref: Ref<QuickOperationModalRef | HTMLDivElement>,
) => {
  const { ...restProps } = props;

  const [form] = Form.useForm();

  const [isShow, setIsShow] = useState(false);
  const [formData, setFormData] = useState<IFormData>({});
  const [loading, setLoading] = useState<boolean>(false);

  useImperativeHandle(ref, () => ({}));

  const onDoubleClickShift = (event: KeyboardEvent) => {
    console.log('=>(index.tsx:38) onDoubleClickShift', event);
    setIsShow(true);
  };

  useKeyDown({ onDoubleClickShift });

  const onChange = (key: string) => {
    console.log(key);
  };

  return (
    <React.Fragment>
      <div
        className={classNames([styles['quick-operation-modal']])}
        style={{
          display: isShow ? 'block' : 'none',
        }}
      >
        <div className={styles.header}>header</div>
        <div className={styles.content}>content</div>
        <div className={styles.footer}>footer</div>
      </div>
    </React.Fragment>
  );
};

export default React.forwardRef(QuickOperationModal);
