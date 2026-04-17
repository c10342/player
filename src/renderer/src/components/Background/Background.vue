<template>
  <div class="background">
    <div class="background__orb background__orb--1"></div>
    <div class="background__orb background__orb--2"></div>
    <div class="background__orb background__orb--3"></div>
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
    filter: blur(80px);
    opacity: 0.35;

    &--1 {
      top: -20%;
      left: -10%;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, var(--orb-1) 0%, transparent 70%);
      animation: float1 12s ease-in-out infinite;
    }

    &--2 {
      right: -15%;
      bottom: -10%;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, #6b3fa0 0%, transparent 70%);
      animation: float2 15s ease-in-out infinite;
    }

    &--3 {
      top: 40%;
      left: 50%;
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, var(--orb-3) 0%, transparent 70%);
      animation: float3 10s ease-in-out infinite;
    }
  }
}

@keyframes float1 {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(40px, 30px);
  }
}

@keyframes float2 {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-30px, -40px);
  }
}

@keyframes float3 {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(20px, -20px);
  }
}
</style>
