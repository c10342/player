<template>
  <div class="app-container">
    <player-header></player-header>
    <player-video></player-video>
    <control-bar></control-bar>
  </div>
</template>

<script lang="ts" setup>
import PlayerVideo from "./components/playerVideo.vue";
import ControlBar from "./components/controlBar.vue";
import PlayerHeader from "./components/playerHeader.vue";
</script>
