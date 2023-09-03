<script setup lang="ts">
import { useElevator } from "~/store/elevator";
const elevator = useElevator();

const isMoving = computed(() => elevator.isMoving);
const isMovingDown = computed(() => elevator.isMovingDown);

const windy = ref();

// wind effect init
onMounted(() => {
  let hrElement;
  let counter = 20;
  for (let i = 0; i < counter; i++) {
    hrElement = document.createElement("HR");
    hrElement.style.left = Math.floor(Math.random() * window.innerWidth) + "px";
    hrElement.style.animationDuration = 0.2 + Math.random() * 0.3 + "s";
    hrElement.style.animationDelay = Math.random() * 2 + "s";
    windy.value.appendChild(hrElement);
  }
});

watch(isMoving, (bool) => {
  if (bool) {
    windy.value.childNodes.forEach((child: { style: { opacity: number } }) => {
      child.style.opacity = 1;
    });
  } else {
    windy.value.childNodes.forEach((child: { style: { opacity: number } }) => {
      child.style.opacity = 0;
    });
  }
});
watch(isMovingDown, (bool) => {
  windy.value.childNodes.forEach(
    (child: { style: { animationDirection: string } }) => {
      child.style.animationDirection = bool ? "reverse" : "normal";
    }
  );
});
</script>
<template>
  <div
    ref="windy"
    class="absolute w-full h-full overflow-hidden bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-100 to-gray-900"
  ></div>
</template>

<style lang="scss">
@import "~/assets/scss/windy.scss";
</style>
