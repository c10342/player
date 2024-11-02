import { createApp } from "vue";
import Menu from "./menu.vue";
import "./style.scss";

export interface MenuItem {
  onClick?: () => any;
  title: string;
}

export const showContextMenu = (options: { items: MenuItem[]; x: number; y: number }) => {
  const div = document.createElement("div");
  div.classList.add("context-menu-container");
  div.style.top = `${options.y}px`;
  div.style.left = `${options.x}px`;
  const app = createApp(Menu, {
    items: options.items
  });
  app.mount(div);
  document.body.appendChild(div);

  const eventList: Array<keyof DocumentEventMap> = ["click", "contextmenu"];
  let first = true;
  const remove = () => {
    if (first) {
      first = false;
      return;
    }
    app.unmount();
    document.body.removeChild(div);
    eventList.forEach((key) => {
      document.removeEventListener(key, remove);
    });
  };
  const addEvent = () => {
    eventList.forEach((key) => {
      document.addEventListener(key, remove);
    });
  };
  addEvent();
};
