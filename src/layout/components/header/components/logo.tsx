import { useTranslation } from 'react-i18next';

const HeaderLogo = () => {
  const { t } = useTranslation();

  return (
    <div>
      <span className={''}>
        <i className={'bi-tag-fill'}></i>
      </span>
      <span className={''}>{t('layout.header.title')}</span>
    </div>
  );
};

export default React.memo(HeaderLogo);
