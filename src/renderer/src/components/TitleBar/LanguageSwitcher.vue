<template>
  <div class="lang-switcher" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
    <button class="lang-switcher__btn" :title="t('language.switchLanguage')">
      <Icon size="16"><LanguageOutline /></Icon>
    </button>
    <div
      v-if="showMenu"
      class="lang-switcher__menu"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
    >
      <button
        v-for="lang in languages"
        :key="lang.value"
        class="lang-switcher__menu-item"
        :class="{ 'lang-switcher__menu-item--active': currentLang === lang.value }"
        @click="switchLanguage(lang.value)"
      >
        {{ lang.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Icon } from "@vicons/utils";
import { LanguageOutline } from "@vicons/ionicons5";
import { useI18n } from "vue-i18n";
import { LocaleEnum } from "@share/enum";

const { locale, t } = useI18n();

const showMenu = ref(false);
let hideTimer: ReturnType<typeof setTimeout> | null = null;

const currentLang = computed(() => locale.value);

const languages = computed(() => [
  { value: LocaleEnum.ZhCN, label: t("language.zhCN") },
  { value: LocaleEnum.ZhTW, label: t("language.zhTW") },
  { value: LocaleEnum.En, label: t("language.en") }
]);

const clearHideTimer = () => {
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
};

const onMouseEnter = () => {
  clearHideTimer();
  showMenu.value = true;
};

const onMouseLeave = () => {
  clearHideTimer();
  hideTimer = setTimeout(() => {
    showMenu.value = false;
  }, 150);
};

const switchLanguage = (lang: string) => {
  locale.value = lang;
  window.electronAPI.setLocale(lang);
  showMenu.value = false;
};
</script>

<style lang="scss" scoped>
.lang-switcher {
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;

  &__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 100%;
    color: var(--text-secondary);
    background: transparent;
    border: none;
    cursor: pointer;
    transition:
      color 0.15s ease,
      background 0.15s ease;

    &:hover {
      color: var(--text-primary);
      background: var(--fill-hover);
    }
  }

  &__menu {
    position: absolute;
    top: 100%;
    right: 0;
    z-index: 200;
    min-width: 140px;
    padding: 4px;
    background: var(--surface-bar);
    border: 1px solid var(--border);
    border-radius: 6px;
    box-shadow: 0 8px 24px rgb(0 0 0 / 40%);
  }

  &__menu-item {
    display: block;
    width: 100%;
    padding: 8px 12px;
    font-size: 12px;
    color: var(--text-secondary);
    text-align: left;
    background: transparent;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition:
      color 0.15s ease,
      background 0.15s ease;

    &:hover {
      color: var(--text-primary);
      background: var(--fill-hover);
    }

    &--active {
      color: var(--accent);
    }
  }
}
</style>
