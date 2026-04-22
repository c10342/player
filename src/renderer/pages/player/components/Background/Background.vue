<template>
  <div class="background">
    <div class="background__orb background__orb--1"></div>
    <div class="background__orb background__orb--2"></div>
    <div class="background__orb background__orb--3"></div>
    <div class="background__grain"></div>
  </div>
</template>

<style lang="scss">
.background {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;

  &__orb {
    position: absolute;
    border-radius: 50%;
    mix-blend-mode: screen;

    &--1 {
      top: -25%;
      left: -15%;
      width: 70vw;
      height: 70vw;
      background: radial-gradient(
        circle at 50% 50%,
        rgb(232 168 73 / 20%) 0%,
        rgb(200 140 60 / 10%) 40%,
        rgb(160 100 30 / 4%) 65%,
        transparent 80%
      );
      filter: blur(100px);
      animation: drift-a 30s ease-in-out infinite;
    }

    &--2 {
      right: -20%;
      bottom: -25%;
      width: 60vw;
      height: 60vw;
      background: radial-gradient(
        circle at 50% 50%,
        rgb(140 110 180 / 15%) 0%,
        rgb(110 80 150 / 6%) 40%,
        rgb(80 50 120 / 2%) 65%,
        transparent 80%
      );
      filter: blur(110px);
      animation: drift-b 35s ease-in-out infinite;
    }

    &--3 {
      top: 25%;
      left: 40%;
      width: 40vw;
      height: 40vw;
      background: radial-gradient(
        circle at 50% 50%,
        rgb(100 160 130 / 12%) 0%,
        rgb(70 120 100 / 5%) 40%,
        transparent 70%
      );
      filter: blur(90px);
      animation: drift-c 25s ease-in-out infinite;
    }
  }

  &__grain {
    position: absolute;
    inset: 0;
    opacity: 0.03;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
    background-repeat: repeat;
    background-size: 200px;
  }
}

@keyframes drift-a {
  0%,
  100% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(15px, 10px);
  }
  50% {
    transform: translate(8px, 22px);
  }
  75% {
    transform: translate(-8px, 12px);
  }
}

@keyframes drift-b {
  0%,
  100% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(-12px, -18px);
  }
  50% {
    transform: translate(-20px, -8px);
  }
  75% {
    transform: translate(-6px, -22px);
  }
}

@keyframes drift-c {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(10px, -12px);
  }
}
</style>
