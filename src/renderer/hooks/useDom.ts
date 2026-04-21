import { onBeforeUnmount, onMounted } from "vue";
import { log } from "@renderer/utils";

export const useDomResize = (target: string, action: (width: number, height: number) => any) => {
  let resizeObserver: ResizeObserver | null;
  onMounted(() => {
    const dom = document.querySelector(target);
    if (!dom) {
      log.error(`useDomResize: ${target} 不存在`);
      return;
    }
    resizeObserver = new ResizeObserver((entries) => {
      // entries是所有触发变化的元素数组
      for (const entry of entries) {
        const { width, height } = entry.contentRect; // 内容区尺寸（不含padding/border）
        action(width, height);
      }
    });
    resizeObserver.observe(dom);
  });

  onBeforeUnmount(() => {
    resizeObserver?.disconnect();
  });
};
