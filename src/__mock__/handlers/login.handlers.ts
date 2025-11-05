import { http, HttpResponse } from 'msw';

export const LoginHandlers = [
  http.post('/api/login/in', () => {
    return HttpResponse.json({
      token: 'fake_user_token',
    });
  }),
  http.get('/api/login/out', () => {
    return HttpResponse.json({
      token: 'fake_user_token',
    });
  }),
];
