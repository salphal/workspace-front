import React, { Ref, useImperativeHandle, useState } from 'react';
import { LanguageName } from '@uiw/codemirror-extensions-langs/src';
import { Form, Input, Select } from 'antd';
import classNames from 'classnames';

import styles from './index.module.scss';
import { CE_FORM_KEYS } from '@/components/code-editor/components/editor-controller/constant.tsx';
import CodeEditorContext from '@/components/code-editor/context.ts';

const { Item } = Form;

export interface ISettings {
  name?: string;
  language?: LanguageName;
  theme?: string;
}

export interface EditorControllerProps {
  value?: ISettings;
  onChange?: (value: ISettings) => void;
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
        </Form>
      </div>
    </React.Fragment>
  );
};

export default React.forwardRef(EditorController);
