let lastShiftTime = 0;
const doubleClickThreshold = 300; // 双击时间间隔阈值

export interface IUseKeyDown {
  onDoubleClickShift?: (event: KeyboardEvent) => void;
}

export const useKeyDown = (props: IUseKeyDown) => {
  const { onDoubleClickShift } = props;

  /** 新增 双击shift 快捷键 */
  useEffect(() => {
    document.addEventListener('keydown', handleDoubleClickShift);
    return () => {
      document.removeEventListener('keydown', handleDoubleClickShift);
    };
  });

  const handleDoubleClickShift = (event: KeyboardEvent) => {
    if (event.key === 'Shift') {
      const currentTime = new Date().getTime();
      if (currentTime - lastShiftTime <= doubleClickThreshold) {
        console.log('Double Shift Pressed!');
        typeof onDoubleClickShift === 'function' && onDoubleClickShift(event);
      }
      lastShiftTime = currentTime;
    }
    // 如果需要监听其他键，可以在这里添加额外的条件判断
    if (event.key === 'A' && event.shiftKey) {
      console.log('Shift + A pressed');
    }
  };

  return {};
};
