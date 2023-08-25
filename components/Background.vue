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
            meme.value.style.marginBottom = "0px";
          break;
      }
      setTimeout(() => {
        resetBackground();
      }, 1500);
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
    <div class="shadow-text" data-text="FIZZ"></div>
  </div>
  <!-- Buzz -->
  <div
    ref="buzz"
    class="absolute h-full w-full bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 transition-all opacity-0"
  >
    <div class="shadow-text" data-text="BUZZ"></div>
  </div>
  <!-- FizzBuzz -->
  <div
    ref="fizzbuzz"
    class="absolute h-full w-full bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-200 via-violet-600 to-sky-900 transition-all opacity-0"
  >
    <div class="shadow-text" data-text="FizzBuzz"></div>
  </div>
  <!-- Just a number -->
  <div  class="absolute bottom-0 left-4  overflow-hidden">
    <img ref="meme" src="/gif/where-you.gif" class="mix-blend-darken w-52 h-52 -mb-52 transition-all" alt="" />
  </div>
</template>

<style lang="scss">
.shadow-text {
  @apply relative leading-relaxed text-[300px] font-primary opacity-80 text-red-500;
}
.shadow-text:before,
.shadow-text:after {
  content: attr(data-text);
}
.shadow-text:before {
  @apply left-0 top-0 absolute -z-10;
  text-shadow: 0px 0px, 0px 0px, 0px 0px, 0px 0px, 0px 0px, 0px 0px, 0px 0px,
    0px 0px, 0px 0px, 0px 0px;
  -webkit-mask: repeating-linear-gradient(
    45deg,
    transparent 0 3px,
    rgba(0, 0, 0, 0.5) 0 6px
  );
  mask: repeating-linear-gradient(
    45deg,
    transparent 0 3px,
    rgba(0, 0, 0, 0.5) 0 6px
  );
}
.shadow-text {
  transform: translate(-10px, -10px);
}
.shadow-text:before {
  text-shadow: 1px 1px, 2px 2px, 3px 3px, 4px 4px, 5px 5px, 6px 6px, 7px 7px,
    8px 8px, 9px 9px, 10px 10px;
}

// animation for windy
hr {
  @apply -ml-[300px] border-r-[600px] border-r-white absolute animate-[windy] transition-opacity duration-1000 opacity-0;
  animation-name: windy;
  animation-duration: 1s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes windy {
  from {
    transform: rotate(90deg) translateX(0);
  }
  to {
    transform: rotate(90deg) translateX(100vh);
  }
}
</style>
