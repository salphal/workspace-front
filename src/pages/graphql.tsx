import React from 'react';
import { GraphqlUserApi } from '@src/api/__example__/graphql.ts';
import { Segmented, Typography } from 'antd';

import styles from './test.module.scss';

const { Title, Paragraph, Text, Link } = Typography;

export interface GraphqlProps {
  [key: string]: any;
}

const Graphql: React.FC<GraphqlProps> = (props: GraphqlProps) => {
  useEffect(() => {}, []);

  // useEffect(() => {
  //   testGraphqlQuery().then((res: any) => {
  //     const { error, data } = res;
  //     if (!error) {
  //       console.log('=>(test.tsx:18) data1', data);
  //     }
  //   });
  // }, []);

  const [segmented, setSegmented] = useState<string>('testGraphqlQuery');

  const [data, setData] = useState([]);

  const socketRef = useRef<any>();

  useEffect(() => {
    GraphqlUserApi.subscribeToUsers({ onMessage: dataOnMessage }).then((ws) => {
      socketRef.current = ws;
    });
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const dataOnMessage = (data: any) => {
    if (Array.isArray(data.envs)) {
      setData(data.envs);
    }
  };

  return (
    <React.Fragment>
      <Segmented<string>
        value={segmented}
        onChange={(value) => {
          setSegmented(value);
        }}
        options={[
          {
            label: '测试 graphql 查询',
            value: 'testGraphqlQuery',
          },
          {
            label: '测试 graphql 修改',
            value: 'testGraphqlMutation',
          },
          {
            label: '测试 graphql 订阅',
            value: 'testGraphqlSubscription',
          },
        ]}
        size={'large'}
        block
      />
      <Typography className={styles.content}>
        {segmented === 'testGraphqlQuery' && (
          <>
            <Paragraph>testGraphqlQuery</Paragraph>
          </>
        )}
        {segmented === 'testGraphqlMutation' && (
          <>
            <Paragraph>testGraphqlMutation</Paragraph>
          </>
        )}
        {segmented === 'testGraphqlSubscription' && (
          <>
            <Paragraph>{JSON.stringify(data)}</Paragraph>
          </>
        )}
      </Typography>
    </React.Fragment>
  );
};

export default React.memo(Graphql);
