import { http, HttpResponse } from 'msw';

export const UserHandlers = [
  // 获取用户信息
  http.get('/api/user/info', () => {
    return HttpResponse.json({
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      roles: ['admin'],
      permissions: ['read', 'write', 'delete'],
    });
  }),

  // 更新用户信息
  http.put('/api/user/info', async ({ request }) => {
    const body = (await request.json()) as any;
    return HttpResponse.json({
      success: true,
      message: '用户信息更新成功',
      data: {
        id: 1,
        username: body.username || 'admin',
        email: body.email || 'admin@example.com',
        avatar: body.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      },
    });
  }),

  // 获取用户列表
  http.get('/api/user/list', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');

    const users = Array.from({ length: pageSize }, (_, index) => ({
      id: (page - 1) * pageSize + index + 1,
      username: `user${(page - 1) * pageSize + index + 1}`,
      email: `user${(page - 1) * pageSize + index + 1}@example.com`,
      status: index % 3 === 0 ? 'active' : 'inactive',
      createTime: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    }));

    return HttpResponse.json({
      success: true,
      data: {
        list: users,
        total: 100,
        page,
        pageSize,
      },
    });
  }),
];
