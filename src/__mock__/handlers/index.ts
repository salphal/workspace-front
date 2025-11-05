import { LoginHandlers } from '@src/__mock__/handlers/login.handlers.ts';
import { UserHandlers } from '@src/__mock__/handlers/user.handlers.ts';

export const handlers = [...LoginHandlers, ...UserHandlers];
