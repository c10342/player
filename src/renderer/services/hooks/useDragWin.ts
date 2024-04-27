import { onBeforeUnmount } from "vue";

/**
 * 拖拽窗口
 * @returns
 */
export const useDragWin = () => {
  let moveIng = false;
  let startX = 0;
  let startY = 0;

  const onMousemove = (event: MouseEvent) => {
    if (!moveIng) return;
    const x = window.screenX + event.clientX - startX;
    const y = window.screenY + event.clientY - startY;
    window.api.setWinPosition({ x, y });
  };

  const onMouseup = () => {
    if (!moveIng) return;
    document.removeEventListener("mousemove", onMousemove);
    document.removeEventListener("mouseup", onMouseup);
    moveIng = false;
  };

  const onMousedown = (event: MouseEvent) => {
    moveIng = true;
    startX = event.clientX;
    startY = event.clientY;
    document.addEventListener("mousemove", onMousemove);
    document.addEventListener("mouseup", onMouseup);
  };

  onBeforeUnmount(() => {
    document.removeEventListener("mousemove", onMousemove);
    document.removeEventListener("mouseup", onMouseup);
  });

  return { onMousedown };
};
