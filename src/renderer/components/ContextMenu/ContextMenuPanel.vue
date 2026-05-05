<template>
  <div
    class="ctx-menu"
    :class="{ 'ctx-menu--submenu': isSubmenu }"
    :style="panelStyle"
    @mouseenter="onPanelEnter"
    @mouseleave="onPanelLeave"
  >
    <template v-for="(item, i) in items" :key="i">
      <div v-if="item.divided" class="ctx-menu__divider" />
      <div
        :class="[
          'ctx-menu__item',
          item.disabled && 'ctx-menu__item--disabled',
          item.children?.length && 'ctx-menu__item--has-submenu'
        ]"
        @click="onItemClick(item)"
        @mouseenter="onItemEnter(i, $event)"
        @mouseleave="onItemLeave"
      >
        <span class="ctx-menu__item-icon">
          <component :is="item.icon" v-if="item.icon" />
        </span>
        <span class="ctx-menu__item-label">{{ item.label }}</span>
        <span v-if="item.children?.length" class="ctx-menu__item-arrow">
          <Icon size="12"><ChevronForward /></Icon>
        </span>
      </div>
    </template>
  </div>
  <template v-for="(item, i) in items" :key="`sub-${i}`">
    <ContextMenuPanel
      v-if="activeChildIndex === i && item.children?.length"
      :items="item.children!"
      :is-submenu="true"
      :sub-left="childSubLeft"
      :sub-top="childSubTop"
      @close="emit('close')"
    />
  </template>
</template>

<script setup lang="ts">
import { ref, computed, inject } from "vue";
import { Icon } from "@vicons/utils";
import { ChevronForward } from "@vicons/ionicons5";
import type { ContextMenuItem } from "./contextMenu";
import { CTX_MENU_TIMER_KEY } from "./contextMenu";

const MENU_MIN_WIDTH = 180;
const SUBMENU_OFFSET_X = 4;
const SUBMENU_OFFSET_Y = -4;

const props = withDefaults(
  defineProps<{
    items: ContextMenuItem[];
    isSubmenu?: boolean;
    left?: number;
    top?: number;
    subLeft?: number;
    subTop?: number;
  }>(),
  {
    isSubmenu: false,
    left: 0,
    top: 0,
    subLeft: 0,
    subTop: 0
  }
);

const emit = defineEmits<{
  close: [];
}>();

const timer = inject(CTX_MENU_TIMER_KEY)!;

const activeChildIndex = ref<number | null>(null);
const childSubLeft = ref(0);
const childSubTop = ref(0);

const panelStyle = computed(() => {
  if (!props.isSubmenu) {
    return {
      position: "fixed" as const,
      left: `${props.left}px`,
      top: `${props.top}px`,
      minWidth: `${MENU_MIN_WIDTH}px`
    };
  }
  return {
    position: "fixed" as const,
    left: `${props.subLeft}px`,
    top: `${props.subTop}px`,
    minWidth: `${MENU_MIN_WIDTH}px`
  };
});

const cancelHideTimer = () => {
  if (timer.value) {
    clearTimeout(timer.value);
    timer.value = null;
  }
};

const startHideTimer = () => {
  if (timer.value) {
    clearTimeout(timer.value);
  }
  timer.value = setTimeout(() => {
    activeChildIndex.value = null;
    timer.value = null;
  }, 150);
};

const onPanelEnter = () => {
  cancelHideTimer();
};

const onPanelLeave = () => {
  startHideTimer();
};

const onItemEnter = (index: number, event: MouseEvent) => {
  cancelHideTimer();
  const item = props.items[index];
  if (!item?.children?.length || item.disabled) {
    activeChildIndex.value = null;
    return;
  }
  activeChildIndex.value = index;

  const target = event.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  const vw = window.innerWidth;

  let sx = rect.right + SUBMENU_OFFSET_X;
  let sy = rect.top + SUBMENU_OFFSET_Y;
  if (sx + MENU_MIN_WIDTH > vw) sx = rect.left - MENU_MIN_WIDTH - SUBMENU_OFFSET_X;
  if (sy < 0) sy = 4;

  childSubLeft.value = sx;
  childSubTop.value = sy;
};

const onItemLeave = () => {
  if (activeChildIndex.value !== null) {
    startHideTimer();
  }
};

const onItemClick = (item: ContextMenuItem) => {
  if (item.disabled) return;
  if (item.children?.length) return;
  item.action?.();
  emit("close");
};
</script>
