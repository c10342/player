<template>
  <div class="app-container">
    <player-header></player-header>
    <div class="middle-container">
      <player-video v-show="videoStore.activeVideo"></player-video>
      <function-grid v-show="!videoStore.activeVideo"></function-grid>
      <play-list></play-list>
    </div>
    <control-bar></control-bar>
  </div>
</template>

<script lang="ts" setup>
import PlayerVideo from "./components/playerVideo.vue";
import ControlBar from "./components/controlBar.vue";
import PlayerHeader from "./components/playerHeader.vue";
import PlayList from "./components/playList.vue";
import FunctionGrid from "./components/functionGrid.vue";
import { useVideoStore } from "./store/video";
const videoStore = useVideoStore();
</script>
