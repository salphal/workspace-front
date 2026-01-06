import React from 'react';

import { ItemType } from 'antd/es/menu/interface';

export interface LayoutNavMenuProps {
  items?: ItemType[];
}

const LayoutNavMenu: React.FC<LayoutNavMenuProps> = (props: LayoutNavMenuProps) => {
  const { items = [] } = props;

  const navigate = useNavigate();

  return (
    <Menu
      theme="light"
      mode="horizontal"
      defaultSelectedKeys={['4']}
      // overflowedIndicator={
      //   screens === 'xs' ? (
      //     <i className={'bi-text-indent-left'} style={{ fontSize: 28, color: gray[3] }} />
      //   ) : (
      //     <EllipsisOutlined />
      //   )
      // }
      items={items}
      onClick={({ key }) => {
        if (key) navigate(key);
      }}
    />
  );
};

export default React.memo(LayoutNavMenu);
