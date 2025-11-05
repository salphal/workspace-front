import { LoginHandlers } from '@src/__mock__/handlers/login.handlers.ts';
import { setupServer } from 'msw/node';

export const server = setupServer(...LoginHandlers);
