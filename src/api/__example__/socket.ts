import { srequest } from '@src/api';

await srequest.connect();

srequest.addOnMessage((data) => {
  console.log('收到消息:', data);
});

srequest.sendMessage({ type: 'join', payload: { room: '123' } });
