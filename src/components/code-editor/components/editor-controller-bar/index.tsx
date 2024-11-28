import React, { Ref, useImperativeHandle, useState } from 'react';
import { LanguageName } from '@uiw/codemirror-extensions-langs/src';
import { Button, Form, Input, Select } from 'antd';
import classNames from 'classnames';

import styles from './index.module.scss';
import { CE_FORM_KEYS } from '@/components/code-editor/components/editor-controller-bar/constant.tsx';
import CodeEditorContext from '@/components/code-editor/context.ts';

const { Item } = Form;

export interface ISettings {
  /** 名称 */
  name?: string;
  /** 语言 */
  language?: LanguageName;
  /** 主题 */
  theme?: string;
}

export interface EditorControllerBarProps {
  value?: ISettings;
  onChange?: (value: ISettings) => void;
}

interface EditorControllerBarRef {}

const EditorControllerBar: React.ForwardRefRenderFunction<
  EditorControllerBarRef,
  EditorControllerBarProps
> = (props: EditorControllerBarProps, ref: Ref<EditorControllerBarRef | HTMLDivElement>) => {
  const { value, onChange, ...restProps } = props;

  const { languageOptions = [], themeOptions = [] } = useContext(CodeEditorContext);

  const [form] = Form.useForm();

  const [formData, setFormData] = useState<ISettings>({});

  useImperativeHandle(ref, () => ({}));

  useEffect(() => {
    form.setFieldsValue(value);
  }, [value]);

  const formOnValueChange = (changedValues: any, allChangedValues: any) => {
    setFormData(allChangedValues);
    typeof onChange === 'function' && onChange(allChangedValues);
  };

  const autoCompleteOnSearch = (query: string) => {
    return languageOptions.filter((v) => v.label.indexOf(query) !== -1);
  };

  return (
    <React.Fragment>
      <div className={classNames([styles['editor-controller']])}>
        <Form form={form} onValuesChange={formOnValueChange} layout={'inline'} size={'small'}>
          <Item name={CE_FORM_KEYS.name}>
            <Input placeholder={'name'} />
          </Item>
          <Item name={CE_FORM_KEYS.language}>
            <Select
              options={languageOptions}
              onSearch={autoCompleteOnSearch}
              style={{ width: 120 }}
              placeholder={'language'}
              autoFocus
              allowClear
              showSearch
            />
          </Item>
          <Item name={CE_FORM_KEYS.theme}>
            <Select
              options={themeOptions}
              placeholder={'theme'}
              style={{ width: 120 }}
              autoFocus
              allowClear
              showSearch
            />
          </Item>
          <Item name={CE_FORM_KEYS.placeholder}>
            <Select
              options={[]}
              placeholder={'placeholder'}
              style={{ width: 120 }}
              autoFocus
              allowClear
              showSearch
            />
          </Item>
          <Item>
            <Button>format</Button>
          </Item>
        </Form>
      </div>
    </React.Fragment>
  );
};

export default React.forwardRef(EditorControllerBar);
