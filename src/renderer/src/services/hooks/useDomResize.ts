import { onBeforeUnmount, onMounted } from "vue";
import { logError } from "../utils";

export const useDomResize = (
  target: () => HTMLElement | null,
  action: (data: ResizeObserverEntry[]) => any
) => {
  let observer: ResizeObserver | null = null;
  onMounted(() => {
    // 要监听大小变化的DOM节点
    const targetNode = target();
    if (!targetNode) {
      logError("targetNode is not defind");
      return;
    }
    // 创建一个 ResizeObserver 实例
    observer = new ResizeObserver((entries) => {
      action(entries);
    });

    // 开始监视目标节点
    observer.observe(targetNode);
  });

  onBeforeUnmount(() => {
    // 解除监听
    observer?.disconnect();
  });
};
