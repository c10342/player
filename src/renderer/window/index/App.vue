<template>
  <div class="app-container">
    <player-header></player-header>
    <div class="middle-container">
      <player-video></player-video>
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
</script>
