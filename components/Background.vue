<script setup lang="ts">
import { useElevator } from "~/store/elevator";
const elevator = useElevator();
const isMoving = computed(() => elevator.isMoving);
const isMovingDown = computed(() => elevator.isMovingDown);
const getFizzBuzz = computed(() => elevator.getFizzBuzz);
const windy = ref();
const fizz = ref();
const buzz = ref();
const fizzbuzz = ref();
const meme = ref();

const resetBackground = () => {
  fizz.value.style.opacity = 0;
  buzz.value.style.opacity = 0;
  fizzbuzz.value.style.opacity = 0;
  meme.value.style.marginBottom = "-208px";
};

watch(isMoving, (bool) => {
  if (!bool) {
    console.log(getFizzBuzz.value);

    setTimeout(() => {
      switch (getFizzBuzz.value) {
        case "Fizz":
          fizz.value.style.opacity = 1;
          break;
        case "Buzz":
          buzz.value.style.opacity = 1;
          break;
        case "FizzBuzz":
          fizzbuzz.value.style.opacity = 1;
          break;
        default:
          if (elevator.floor > 0) {
            meme.value.style.marginBottom = "0px";
          }
          break;
      }
      setTimeout(() => {
        resetBackground();
      }, 1000);
    }, 1500);
  }
});

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
  <div>
    <!-- default -->
    <div
      class="absolute w-full h-full bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-100 to-gray-900 overflow-hidden"
    >
      <div ref="windy"></div>
    </div>
  </div>
  <!-- Fizz -->
  <div
    ref="fizz"
    class="absolute h-full w-full bg-gradient-to-r from-yellow-200 via-green-200 to-green-300 transition-all opacity-0"
  >
    <div class="fizz">FIZZ</div>
  </div>

  <!-- Buzz -->
  <div
    ref="buzz"
    class="absolute h-full w-full bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 transition-all opacity-0"
  >
    <div class="buzz" data-text="BUZZ"></div>
  </div>
  <!-- FizzBuzz -->
  <div
    ref="fizzbuzz"
    class="absolute h-full w-full bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-orange-900 via-amber-100 to-orange-900 transition-all opacity-0"
  >
    <div class="fizzbuzz" data-text="FIZZBUZZ"></div>
  </div>
  <!-- Just a number -->
  <!-- <div class="absolute bottom-0 left-4 overflow-hidden">
    <img
      ref="meme"
      src="/gif/where-you.gif"
      class="mix-blend-darken w-52 h-52 -mb-52 transition-all"
      alt=""
    />
  </div> -->
</template>

<style lang="scss">
@import "~/assets/scss/fizz.scss";
@import "~/assets/scss/buzz.scss";
@import "~/assets/scss/fizzbuzz.scss";
@import "~/assets/scss/windy.scss";

</style>
