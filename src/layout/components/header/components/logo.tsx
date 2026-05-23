import { useTranslation } from 'react-i18next';

const HeaderLogo = () => {
  const { t } = useTranslation();

  return (
    <div>
      <span className={''}>
        <i className={'bi-tag-fill'} />
      </span>
      <span className={'header-title'}>{t('layout.header.title')}</span>
    </div>
  );
};

export default React.memo(HeaderLogo);
