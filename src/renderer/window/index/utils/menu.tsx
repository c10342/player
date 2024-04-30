import { createVNode, defineComponent, render } from "vue";
import { Menu, MenuItem } from "ant-design-vue";
import { Instance, createPopper } from "@popperjs/core";
import { GlobalEventEnum } from "@share/enum";

// 单例
let destroyMenu: null | (() => any) = null;

interface MenuItemType {
  label: string;
  action: (...args: any) => any;
}

export const openMenu = async (menus: MenuItemType[]) => {
  if (destroyMenu) {
    destroyMenu();
    destroyMenu = null;
  }
  const mousePosition = await window.api.getMousePosition();
  const winPosition = await window.api.getWinPosition();
  // 计算鼠标在窗口的位置
  const pageX = mousePosition.x - (winPosition?.x ?? 0) - 5;
  const pageY = mousePosition.y - (winPosition?.y ?? 0) - 50;
  let popperInstance: Instance | null = null;
  let vm: any = null;
  // Popper容器
  let popperDiv: HTMLDivElement | null = document.createElement("div");
  popperDiv.style.left = `${pageX}px`;
  popperDiv.style.top = `${pageY}px`;
  popperDiv.style.position = "fixed";
  popperDiv.style.zIndex = "100";
  // jsx附着的容器，也是Popper需要显示的内容
  let div: HTMLDivElement | null = document.createElement("div");
  const onClick = () => {
    destroyMenu?.();
  };
  destroyMenu = () => {
    popperInstance?.destroy();
    document.body.removeChild(vm.el as HTMLElement);
    popperDiv && document.body.removeChild(popperDiv);
    div && render(null, div);
    window.api.off(GlobalEventEnum.Click, onClick);
    // 销毁。防止闭包造成内存泄漏
    destroyMenu = null;
    popperDiv = null;
    vm = null;
    div = null;
  };

  const tsxComponent = defineComponent({
    setup() {
      const onMenuClick = (data: { key: number }) => {
        const action = menus[data.key].action;
        action?.();
        destroyMenu?.();
      };

      return { onMenuClick };
    },
    render() {
      const { onMenuClick } = this;
      return (
        <Menu onClick={onMenuClick}>
          {menus.map((menu, index) => {
            return <MenuItem key={index}>{menu.label}</MenuItem>;
          })}
        </Menu>
      );
    }
  });

  vm = createVNode(tsxComponent);

  render(vm, div);

  document.body.appendChild(vm.el as HTMLElement);
  document.body.appendChild(popperDiv);
  popperInstance = createPopper(popperDiv, vm.el as HTMLElement, {
    placement: "right-start"
  });
  // document.addEventListener("click", onDocumemtClick);
  window.api.on(GlobalEventEnum.Click, onClick);
};
