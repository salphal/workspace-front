import { EventEmitter } from 'events';

/**
 * 全局事件总线
 */
const eventBus = new EventEmitter();

// const handDemo = () => {};
// eventBus.on('demoEventBus', handDemo); // 创建事件线, 并添加事件
// eventBus.off('demoEventBus', handDemo); // 从指定事件线中删除事件
// eventBus.emit('demoEventBus', handDemo); // 触发事件
// eventBus.once('demoEventBus', handDemo); // 只触发一次事件线

export default eventBus;
