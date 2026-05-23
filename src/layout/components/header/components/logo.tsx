import { useTranslation } from 'react-i18next';

import { Space } from 'antd';

const HeaderLogo = () => {
  const { t } = useTranslation();

  return (
    <Space>
      <span className={'header-logo'}>
        <i className="bi bi-grid-1x2-fill"></i>
      </span>
      <span className={'header-title'}>{t('layout.header.title')}</span>
    </Space>
  );
};

export default React.memo(HeaderLogo);
