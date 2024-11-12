import { EventEmitter } from 'events';

/**
 * 全局事件总线
 * - eventBus.on('demoEventBus', handler) 添加事件到指定事件线
 * - eventBus.off('demoEventBus', handler) 从指定事件线中删除事件
 * - eventBus.emit('demoEventBus', data) 触发指定事件线上的事件
 * - eventBus.once('demoEventBus', handler) 仅触发一次指定事件线上的事件
 */
const eventBus = new EventEmitter();

export default eventBus;
