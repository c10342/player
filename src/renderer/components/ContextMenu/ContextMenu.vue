<template>
  <div class="ctx-menu-root">
    <div ref="menuRef">
      <ContextMenuPanel
        :items="options.items"
        :is-submenu="false"
        :left="position.x"
        :top="position.y"
        @close="close"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, provide, onMounted, onBeforeUnmount } from "vue";
import ContextMenuPanel from "./ContextMenuPanel.vue";
import type { ContextMenuOptions } from "./contextMenu";
import { CTX_MENU_TIMER_KEY } from "./contextMenu";

const props = defineProps<{
  options: Required<ContextMenuOptions>;
}>();

const emit = defineEmits<{
  close: [];
}>();

const menuRef = ref<HTMLElement | null>(null);
const position = ref({ x: props.options.x, y: props.options.y });
const timer = reactive({ value: null as ReturnType<typeof setTimeout> | null });

provide(CTX_MENU_TIMER_KEY, timer);

const close = () => {
  emit("close");
};

const adjustPosition = () => {
  requestAnimationFrame(() => {
    const panel = menuRef.value?.querySelector(".ctx-menu") as HTMLElement | null;
    if (!panel) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let x = position.value.x;
    let y = position.value.y;
    if (x + panel.offsetWidth > vw) x = vw - panel.offsetWidth - 4;
    if (y + panel.offsetHeight > vh) y = vh - panel.offsetHeight - 4;
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
