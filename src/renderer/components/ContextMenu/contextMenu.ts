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
  x?: number;
  y?: number;
  items: ContextMenuItem[];
}

let lastContextPos = { x: 0, y: 0 };

export function initContextMenu() {
  document.addEventListener(
    "contextmenu",
    (e) => {
      lastContextPos = { x: e.clientX, y: e.clientY };
    },
    true
  );
}

export function showContextMenu(options: ContextMenuOptions): () => void {
  const container = document.createElement("div");
  document.body.appendChild(container);

  const menuOptions = {
    x: options.x ?? lastContextPos.x,
    y: options.y ?? lastContextPos.y,
    items: options.items
  };

  const app = createApp({
    setup() {
      return () =>
        h(ContextMenuVue, {
          options: menuOptions,
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
