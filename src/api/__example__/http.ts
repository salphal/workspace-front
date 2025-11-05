// 定义响应数据类型

import { hrequest } from '@src/api';

interface User {
  id: number;
  name: string;
  email: string;
}

export const HttpUserApi = {
  // 示例 1: GET 请求 - 获取用户列表
  getUsers: async (): Promise<User[]> => {
    try {
      const response = await hrequest.get<User[]>({
        url: '/users',
      });
      console.log('获取用户列表成功:', response);
      return response;
    } catch (error) {
      console.error('获取用户列表失败:', error);
      throw error;
    }
  },

  // 示例 2: POST 请求 - 创建用户
  createUser: async (userData: Omit<User, 'id'>): Promise<User> => {
    try {
      const response = await hrequest.post<User>({
        url: '/users',
        data: userData,
      });
      console.log('创建用户成功:', response);
      return response;
    } catch (error) {
      console.error('创建用户失败:', error);
      throw error;
    }
  },

  // 示例 3: PUT 请求 - 更新用户
  updateUser: async (id: number, userData: Partial<User>): Promise<User> => {
    try {
      const response = await hrequest.put<User>({
        url: `/users/${id}`,
        data: userData,
      });
      console.log('更新用户成功:', response);
      return response;
    } catch (error) {
      console.error('更新用户失败:', error);
      throw error;
    }
  },

  // 示例 4: DELETE 请求 - 删除用户
  deleteUser: async (id: number): Promise<void> => {
    try {
      const response = await hrequest.delete<void>({
        url: `/users/${id}`,
      });
      console.log('删除用户成功:', response);
      return response;
    } catch (error) {
      console.error('删除用户失败:', error);
      throw error;
    }
  },
};

export const HttpFileApi = {
  // 示例1: 上传文件
  uploadFile: async (file: File): Promise<{ url: string }> => {
    try {
      const response = await hrequest.upload<{ url: string }>('/upload', {
        file,
      });
      console.log('文件上传成功:', response);
      return response;
    } catch (error) {
      console.error('文件上传失败:', error);
      throw error;
    }
  },

  // 示例2: 下载文件
  downloadFile: async (fileId: string, fileName: string): Promise<void> => {
    try {
      const blob = await hrequest.download<Blob>(`/files/${fileId}`, {});

      // 创建下载链接
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log('文件下载成功');
    } catch (error) {
      console.error('文件下载失败:', error);
      throw error;
    }
  },
};
