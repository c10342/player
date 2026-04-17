<template>
  <div class="track-info">
    <div class="track-info__cover" :class="{ 'track-info__cover--spinning': playing }">
      <div class="track-info__cover-inner">
        <svg viewBox="0 0 48 48" fill="none" width="48" height="48">
          <circle
            cx="24"
            cy="24"
            r="23"
            :fill="'var(--dark)'"
            :stroke="'var(--border)'"
            stroke-width="1"
          />
          <circle cx="24" cy="24" r="16" fill="none" :stroke="'var(--border)'" stroke-width="0.5" />
          <circle cx="24" cy="24" r="10" fill="none" :stroke="'var(--border)'" stroke-width="0.5" />
          <circle cx="24" cy="24" r="4" :fill="'var(--accent)'" />
          <circle cx="24" cy="12" r="1.5" :fill="'var(--text-muted)'" />
        </svg>
      </div>
    </div>
    <div class="track-info__meta">
      <div class="track-info__title">{{ title }}</div>
      <div class="track-info__artist">{{ artist }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  artist: string;
  playing: boolean;
}>();
</script>

<style lang="scss">
.track-info {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;

  &__cover {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: 0 2px 12px rgb(0 0 0 / 40%);

    &--spinning {
      animation: spin 4s linear infinite;
    }
  }

  &__cover-inner {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--dark);
  }

  &__meta {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  &__title {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__artist {
    font-size: 11px;
    color: var(--text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
