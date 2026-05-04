<template>
  <div class="ctx-menu-root">
    <div
      ref="menuRef"
      class="ctx-menu"
      :style="{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        minWidth: `${MENU_MIN_WIDTH}px`
      }"
    >
      <template v-for="(item, i) in options.items" :key="i">
        <div v-if="item.divided" class="ctx-menu__divider" />
        <div
          :class="[
            'ctx-menu__item',
            item.disabled && 'ctx-menu__item--disabled',
            item.children?.length && 'ctx-menu__item--has-submenu'
          ]"
          @click="onItemClick(item)"
          @mouseenter="showSubmenu(i, $event)"
          @mouseleave="hideSubmenu"
        >
          <span class="ctx-menu__item-icon">
            <component :is="item.icon" v-if="item.icon" />
          </span>
          <span class="ctx-menu__item-label">{{ item.label }}</span>
          <span v-if="item.children?.length" class="ctx-menu__item-arrow">▸</span>
        </div>
      </template>
    </div>
    <div
      v-if="submenuItems"
      class="ctx-menu ctx-menu--submenu"
      :style="submenuStyle"
      @mouseleave="hideSubmenu"
    >
      <template v-for="(item, i) in submenuItems" :key="i">
        <div v-if="item.divided" class="ctx-menu__divider" />
        <div
          :class="[
            'ctx-menu__item',
            item.disabled && 'ctx-menu__item--disabled',
            item.children?.length && 'ctx-menu__item--has-submenu'
          ]"
          @click="onItemClick(item)"
          @mouseenter="() => {}"
          @mouseleave="hideSubmenu"
        >
          <span class="ctx-menu__item-icon">
            <component :is="item.icon" v-if="item.icon" />
          </span>
          <span class="ctx-menu__item-label">{{ item.label }}</span>
          <span v-if="item.children?.length" class="ctx-menu__item-arrow">▸</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import type { ContextMenuItem, ContextMenuOptions } from "./contextMenu";

const MENU_MIN_WIDTH = 180;
const SUBMENU_OFFSET_X = 4;
const SUBMENU_OFFSET_Y = -4;

const props = defineProps<{
  options: Required<ContextMenuOptions>;
}>();

const emit = defineEmits<{
  close: [];
}>();

const menuRef = ref<HTMLElement | null>(null);
const position = ref({ x: props.options.x, y: props.options.y });
const activeSubmenuIndex = ref<number | null>(null);
const submenuStyle = ref<Record<string, string>>({});

const submenuItems = computed(() => {
  if (activeSubmenuIndex.value === null) return null;
  return props.options.items[activeSubmenuIndex.value]?.children ?? null;
});

const close = () => {
  emit("close");
};

const adjustPosition = () => {
  requestAnimationFrame(() => {
    const el = menuRef.value;
    if (!el) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let x = position.value.x;
    let y = position.value.y;
    if (x + el.offsetWidth > vw) x = vw - el.offsetWidth - 4;
    if (y + el.offsetHeight > vh) y = vh - el.offsetHeight - 4;
    if (x < 0) x = 4;
    if (y < 0) y = 4;
    position.value = { x, y };
  });
};

const handleGlobalClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (target.closest(".ctx-menu-root")) return;
  close();
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape") close();
};

const showSubmenu = (index: number, event: MouseEvent) => {
  const item = props.options.items[index];
  if (!item?.children?.length || item.disabled) {
    activeSubmenuIndex.value = null;
    return;
  }
  activeSubmenuIndex.value = index;

  const target = event.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const submenuEl = target
    .closest(".ctx-menu-root")
    ?.querySelector(".ctx-menu--submenu") as HTMLElement | null;
  const subWidth = submenuEl?.offsetWidth || 180;
  const subHeight = submenuEl?.offsetHeight || 100;

  let sx = rect.right + SUBMENU_OFFSET_X;
  let sy = rect.top + SUBMENU_OFFSET_Y;

  if (sx + subWidth > vw) sx = rect.left - subWidth - SUBMENU_OFFSET_X;
  if (sy + subHeight > vh) sy = vh - subHeight - 4;
  if (sy < 0) sy = 4;

  submenuStyle.value = {
    position: "fixed",
    left: `${sx}px`,
    top: `${sy}px`,
    minWidth: `${MENU_MIN_WIDTH}px`
  };
};

const hideSubmenu = () => {
  activeSubmenuIndex.value = null;
};

const onItemClick = (item: ContextMenuItem) => {
  if (item.disabled) return;
  if (item.children?.length) return;
  item.action?.();
  close();
};

onMounted(() => {
  document.addEventListener("click", handleGlobalClick, true);
  document.addEventListener("contextmenu", handleGlobalClick, true);
  document.addEventListener("keydown", handleKeydown, true);
  adjustPosition();
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleGlobalClick, true);
  document.removeEventListener("contextmenu", handleGlobalClick, true);
  document.removeEventListener("keydown", handleKeydown, true);
});
</script>

<style lang="scss">
.ctx-menu-root {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999;
  pointer-events: none;
  user-select: none;
}

.ctx-menu {
  position: fixed;
  pointer-events: auto;
  padding: 4px 0;
  background: var(--surface-bar);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow:
    0 8px 32px rgb(0 0 0 / 50%),
    0 2px 8px rgb(0 0 0 / 30%);
  animation: ctx-menu-in 0.12s ease-out;

  &--submenu {
    animation: ctx-menu-submenu-in 0.1s ease-out;
  }

  &__item {
    display: flex;
    gap: 8px;
    align-items: center;
    height: 32px;
    padding: 0 12px;
    margin: 0 4px;
    font-size: 13px;
    color: var(--text-primary);
    cursor: pointer;
    border-radius: 4px;
    transition: background 0.1s ease;

    &:hover:not(&--disabled) {
      background: var(--fill-hover);
    }

    &--disabled {
      cursor: default;
      opacity: 0.35;
    }

    &--has-submenu {
      &:hover:not(&--disabled) {
        background: var(--fill-hover);
        border-radius: 4px;
      }
    }
  }

  &__item-icon {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    font-size: 14px;
    color: var(--text-secondary);
  }

  &__item-label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__item-arrow {
    flex-shrink: 0;
    padding-left: 16px;
    margin-left: auto;
    font-size: 10px;
    color: var(--text-muted);
  }

  &__divider {
    height: 1px;
    margin: 4px 12px;
    background: var(--border);
  }
}

@keyframes ctx-menu-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes ctx-menu-submenu-in {
  from {
    opacity: 0;
    transform: translateX(-4px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
