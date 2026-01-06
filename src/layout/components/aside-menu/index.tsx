import React from 'react';

import { ItemType } from 'antd/es/menu/interface';

export interface LayoutAsideMenuProps {
  items?: ItemType[];
}

const LayoutAsideMenu: React.FC<LayoutAsideMenuProps> = (props: LayoutAsideMenuProps) => {
  const { items = [] } = props;

  const navigate = useNavigate();

  return (
    <Menu
      theme="light"
      mode="inline"
      defaultSelectedKeys={['/test']}
      items={items}
      style={{ height: '100%' }}
      onClick={({ key }) => {
        if (key) navigate(key);
      }}
    />
  );
};

export default React.memo(LayoutAsideMenu);
