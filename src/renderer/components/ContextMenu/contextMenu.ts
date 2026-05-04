import { createApp, h } from "vue";
import ContextMenuVue from "./ContextMenu.vue";

export interface ContextMenuItem {
  label: string;
  icon?: any;
  disabled?: boolean;
  divided?: boolean;
  children?: ContextMenuItem[];
  action?: () => void;
}

export interface ContextMenuOptions {
  x: number;
  y: number;
  items: ContextMenuItem[];
}

export function showContextMenu(options: ContextMenuOptions): () => void {
  const container = document.createElement("div");
  document.body.appendChild(container);

  const app = createApp({
    setup() {
      return () =>
        h(ContextMenuVue, {
          options,
          onClose: () => {
            app.unmount();
            container.remove();
          }
        });
    }
  });

  app.mount(container);

  const close = () => {
    app.unmount();
    container.remove();
  };

  return close;
}
