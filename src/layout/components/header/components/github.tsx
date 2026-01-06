import { GithubFilled } from '@ant-design/icons';

const HeaderGithub = () => {
  return (
    <Button
      type={'text'}
      icon={<GithubFilled style={{ display: 'block', fontSize: 22 }} />}
      style={{ display: 'block' }}
    />
  );
};

export default React.memo(HeaderGithub);
