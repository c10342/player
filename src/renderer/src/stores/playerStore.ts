import { defineStore } from "pinia";
import { ref, computed } from "vue";

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
}

export const usePlayerStore = defineStore("player", () => {
  const playing = ref(false);
  const currentTime = ref(0);
  const duration = ref(0);
  const volume = ref(0.7);
  const isMuted = ref(false);
  const fullscreen = ref(false);

  const tracks = ref<Track[]>([]);
  const activeIndex = ref(-1);

  const currentTrack = computed(() => {
    if (activeIndex.value >= 0 && activeIndex.value < tracks.value.length) {
      return tracks.value[activeIndex.value];
    }
    return null;
  });

  const formattedCurrentTime = computed(() => formatTime(currentTime.value));
  const formattedDuration = computed(() => formatTime(duration.value));

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  function togglePlay() {
    playing.value = !playing.value;
  }

  function stop() {
    playing.value = false;
    currentTime.value = 0;
  }

  function prev() {
    if (activeIndex.value > 0) {
      activeIndex.value--;
      currentTime.value = 0;
    }
  }

  function next() {
    if (activeIndex.value < tracks.value.length - 1) {
      activeIndex.value++;
      currentTime.value = 0;
    }
  }

  function setVolume(val: number) {
    volume.value = Math.max(0, Math.min(1, val));
  }

  function toggleMute() {
    isMuted.value = !isMuted.value;
  }

  function toggleFullscreen() {
    fullscreen.value = !fullscreen.value;
  }

  function seek(time: number) {
    currentTime.value = Math.max(0, Math.min(time, duration.value));
  }

  function setTracks(list: Track[]) {
    tracks.value = list;
    if (activeIndex.value === -1 && list.length > 0) {
      activeIndex.value = 0;
    }
  }

  function addTrack(track: Track) {
    tracks.value.push(track);
    if (activeIndex.value === -1) {
      activeIndex.value = 0;
    }
  }

  function removeTrack(index: number) {
    tracks.value.splice(index, 1);
    if (tracks.value.length === 0) {
      activeIndex.value = -1;
      playing.value = false;
    } else if (activeIndex.value >= tracks.value.length) {
      activeIndex.value = tracks.value.length - 1;
    }
  }

  function selectTrack(index: number) {
    if (index >= 0 && index < tracks.value.length) {
      activeIndex.value = index;
      currentTime.value = 0;
      playing.value = true;
    }
  }

  return {
    playing,
    currentTime,
    duration,
    volume,
    isMuted,
    fullscreen,
    tracks,
    activeIndex,
    currentTrack,
    formattedCurrentTime,
    formattedDuration,
    togglePlay,
    stop,
    prev,
    next,
    setVolume,
    toggleMute,
    toggleFullscreen,
    seek,
    setTracks,
    addTrack,
    removeTrack,
    selectTrack
  };
});
