import React, { Ref, useImperativeHandle, useState } from 'react';
import { LanguageName } from '@uiw/codemirror-extensions-langs/src';
import { Form, Input, Select } from 'antd';
import classNames from 'classnames';

import styles from './index.module.scss';
import { CE_FORM_KEYS } from '@/components/code-editor/components/editor-controller/constant.tsx';

const { Item } = Form;

type selectOptions = Array<{ label: string; value: any }>;

// export type EditorTheme = defaultThemeNames & themeNames;

export interface IFormData {
  name?: string;
  language?: LanguageName;
  theme?: string;
}

export interface EditorControllerProps {
  value?: IFormData;
  onChange?: (value: IFormData) => void;
  languageOptions?: selectOptions;
  themeOptions?: selectOptions;
}

export interface EditorControllerMethods {}

interface EditorControllerRef {}

const EditorController: React.ForwardRefRenderFunction<
  EditorControllerRef,
  EditorControllerProps
> = (
  props: EditorControllerProps & EditorControllerMethods,
  ref: Ref<EditorControllerRef | HTMLDivElement>,
) => {
  const { value, onChange, languageOptions = [], themeOptions = [], ...restProps } = props;

  const [form] = Form.useForm();

  const [formData, setFormData] = useState<IFormData>({});

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
        </Form>
      </div>
    </React.Fragment>
  );
};

export default React.forwardRef(EditorController);
