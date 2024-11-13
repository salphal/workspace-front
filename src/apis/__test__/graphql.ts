import { grequest } from '@/apis/core/instance.ts';

export const testGraphqlQuery = (variables = {}) => {
  return grequest.query<{ id: number; name: string; remark: string }[]>({
    query: `query queryEnvs {
      envs {
        id
        name
        remark
      }
    }
  `,
    variables,
  });
};

export const testGraphqlMutation = (variables = {}) => {
  return grequest.query<{ id: number; name: string; remark: string }[]>({
    query: `mutation mutationEnvs {
      envs {
        id
        name
        remark
      }
    }
  `,
    variables,
  });
};

export const testGraphqlSubscription = (config: any) => {
  const { onMessage, variables = {} } = config;
  return grequest.subscription({
    query: `subscription subscriptionEnvs {
      envs {
        remark
        name
        id
      }
    }`,
    variables,
    onMessage,
  });
};
