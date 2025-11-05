import { server } from '@src/__mock__/node.ts';
import { http, HttpResponse } from 'msw';

// 简单的 msw 测试
describe('MSW Basic API mocking', () => {
  it('should mock basic API calls', async () => {
    // 添加一个简单的测试 handler
    server.use(
      http.get('/api/test/simple', () => {
        return HttpResponse.json({ message: 'Hello from MSW' });
      }),
    );

    // 使用 fetch 进行测试，避免 axios 的复杂性问题
    const response = await fetch('/api/test/simple');
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ message: 'Hello from MSW' });
  }, 10000);

  it('should handle existing login handler', async () => {
    const response = await fetch('/api/login/in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'test',
        password: 'test',
      }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ token: 'fake_user_token' });
  }, 10000);
});
