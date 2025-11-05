// src/api/graphql/user.ts
import { grequest } from '@src/api';

interface User {
  id: number;
  name: string;
  email: string;
}

/**
 * 统一错误处理函数
 */
const handleGraphqlError = async <T>(fn: () => Promise<T>, action: string): Promise<T> => {
  try {
    const result = await fn();
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ ${action} 成功:`, result);
    }
    return result;
  } catch (error) {
    console.error(`❌ ${action} 失败:`, error);
    throw error;
  }
};

/**
 * GraphQL 用户 API
 */
export const GraphqlUserApi = {
  /**
   * 获取用户列表 (Query)
   */
  getUsers: async (variables = {}): Promise<User[]> => {
    return handleGraphqlError(async () => {
      const response = await grequest.query<{ users: User[] }>({
        query: `
          query queryUsers {
            users {
              id
              name
              email
            }
          }
        `,
        variables,
      });
      return response.data.users;
    }, '获取用户列表');
  },

  /**
   * 创建用户 (Mutation)
   */
  createUser: async (variables: { name: string; email: string }): Promise<User> => {
    return handleGraphqlError(async () => {
      const response = await grequest.mutation<{ createUser: User }>({
        query: `
          mutation createUser($name: String!, $email: String!) {
            createUser(name: $name, email: $email) {
              id
              name
              email
            }
          }
        `,
        variables,
      });
      return response.data.createUser;
    }, '创建用户');
  },

  /**
   * 更新用户 (Mutation)
   */
  updateUser: async (variables: { id: number; name?: string; email?: string }): Promise<User> => {
    return handleGraphqlError(async () => {
      const response = await grequest.mutation<{ updateUser: User }>({
        query: `
          mutation updateUser($id: Int!, $name: String, $email: String) {
            updateUser(id: $id, name: $name, email: $email) {
              id
              name
              email
            }
          }
        `,
        variables,
      });
      return response.data.updateUser;
    }, '更新用户');
  },

  /**
   * 删除用户 (Mutation)
   */
  deleteUser: async (variables: { id: number }): Promise<boolean> => {
    return handleGraphqlError(async () => {
      const response = await grequest.mutation<{ deleteUser: boolean }>({
        query: `
          mutation deleteUser($id: Int!) {
            deleteUser(id: $id)
          }
        `,
        variables,
      });
      return response.data.deleteUser;
    }, '删除用户');
  },

  /**
   * 订阅用户变化 (Subscription)
   * 返回取消订阅函数
   */
  subscribeToUsers: async (config: {
    onMessage: (data: any) => void;
    variables?: Record<string, any>;
  }): Promise<() => void> => {
    return handleGraphqlError(async () => {
      const { onMessage, variables = {} } = config;
      const unsubscribe = await grequest.subscription({
        query: `
          subscription subscriptionUsers {
            users {
              id
              name
              email
            }
          }
        `,
        variables,
        onMessage,
      });

      if (process.env.NODE_ENV === 'development') {
        console.log('📡 已订阅用户变化');
      }

      /** 返回取消订阅函数 */
      return unsubscribe;
    }, '订阅用户变化');
  },
};
