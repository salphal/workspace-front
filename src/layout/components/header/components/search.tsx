import { gray } from '@ant-design/colors';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { SearchOutlined } from '@ant-design/icons';

const InputSuffix = styled.div`
  padding: 4px 8px;
  color: #ced4d9;
  background-color: rgba(150, 150, 150, 0.06);
  border-width: 1px;
  border-color: rgba(100, 100, 100, 0.2);
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
`;

const HeaderSearch = () => {
  const { t } = useTranslation();

  return (
    <Input
      placeholder={t('layout.header.input.placeholder')}
      addonBefore={<SearchOutlined style={{ color: gray[2] }} />}
      addonAfter={<InputSuffix>⌘ K</InputSuffix>}
      variant="borderless"
      style={{ width: 280 }}
    />
  );
};

export default React.memo(HeaderSearch);
