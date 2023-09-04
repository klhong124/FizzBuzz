<script setup lang="ts">
import { useElevator } from "~/store/elevator";
import { DOOR_OPEN_TIMEOUT, SHOW_BACKGROUND_TIMEOUT } from "@/utils/constants";

const elevator = useElevator();
const isMoving = computed(() => elevator.isMoving);

const hiddenBackground = ref();
const magicText = ref();
let awaitDoorOpen: NodeJS.Timeout;

const getHiddenBackground = computed(() => {
  switch (magicText.value) {
    case "fizz":
      return "bg-gradient-to-r from-yellow-200 via-green-200 to-green-300";
    case "buzz":
      return "bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400";
    case "fizzbuzz":
      return "bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-orange-900 via-amber-100 to-orange-900";
  }
  return "";
});

watch(isMoving, (moving) => {
  const changeBackground = () => {
    // set magic text
    magicText.value = elevator.getFizzBuzz;
    +magicText.value < 10 && (magicText.value = "0" + magicText.value);

    // show background
    hiddenBackground.value.style.opacity = 1;
    setTimeout(() => {
      hiddenBackground.value.style.opacity = 0;
    }, SHOW_BACKGROUND_TIMEOUT);
  };

  if (!moving) {
    awaitDoorOpen = setTimeout(() => {
      changeBackground();
    }, DOOR_OPEN_TIMEOUT);
  } else {
    clearTimeout(awaitDoorOpen);
    hiddenBackground.value.style.opacity = 0;
  }
});
</script>
<template>
  <!-- Background with Windy effect always be shown -->
  <WindyBackground />

  <!-- HiddenBackground shows after the elevator stopped -->
  <div
    ref="hiddenBackground"
    :class="[
      'absolute w-full h-full overflow-hidden transition-all opacity-0',
      getHiddenBackground,
    ]"
  >
    <div
      v-if="elevator.floor > 0"
      :class="elevator.isJustNumber ? 'just-number' : magicText"
      :data-text="magicText"
    >
      {{ magicText }}
    </div>
  </div>
</template>

<style lang="scss">
@import "~/assets/scss/fizz.scss";
@import "~/assets/scss/buzz.scss";
@import "~/assets/scss/fizzbuzz.scss";
@import "~/assets/scss/just-number.scss";
</style>
