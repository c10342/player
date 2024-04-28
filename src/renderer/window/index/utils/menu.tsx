import { createVNode, defineComponent, render } from "vue";
import { ItemType, Menu, MenuItem, Dropdown } from "ant-design-vue";

// 单例
let destroyMenu: null | (() => any) = null;

export const openMenu = async () => {
  if (destroyMenu) {
    destroyMenu();
    destroyMenu = null;
  }
  const mousePosition = await window.api.getMousePosition();
  const winPosition = await window.api.getWinPosition();
  const pageX = mousePosition.x - (winPosition?.x ?? 0) - 5;
  const pageY = mousePosition.y - (winPosition?.y ?? 0) - 50;

  const onDocumemtClick = () => {
    destroyMenu?.();
  };
  const div = document.createElement("div");
  destroyMenu = () => {
    document.body.removeChild(vm.el as HTMLElement);
    render(null, div);
    document.removeEventListener("click", onDocumemtClick);
    destroyMenu = null;
  };

  const tsxComponent = defineComponent({
    setup() {
      const onMenuClick = () => {
        destroyMenu?.();
      };

      return { onMenuClick };
    },
    render() {
      const { onMenuClick } = this;
      return (
        <div class="menu-container" style={{ left: `${pageX}px`, top: `${pageY}px` }}>
          <Dropdown
            open={true}
            v-slots={{
              overlay() {
                return (
                  <Menu onClick={onMenuClick}>
                    <MenuItem>1st menu item</MenuItem>
                    <MenuItem>2nd menu item</MenuItem>
                    <MenuItem>3rd menu item</MenuItem>
                  </Menu>
                );
              },
              default() {
                return "";
              }
            }}
          ></Dropdown>
        </div>
      );
    }
  });

  const vm = createVNode(tsxComponent);

  render(vm, div);

  document.body.appendChild(vm.el as HTMLElement);

  document.addEventListener("click", onDocumemtClick);
};
