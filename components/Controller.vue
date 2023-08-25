<script setup lang="ts">
import { useElevator } from "~/store/elevator";
const elevator = useElevator();

const inputNumber = ref("0");
const locked = ref(false);
const resetOnNext = ref(false);

const isMoving = computed(() => elevator.isMoving);
watch(isMoving, (bool) => {
  if (bool) {
    locked.value = true;
  } else {
    locked.value = false;
    resetOnNext.value = true;
  }
});

const buttonOnClick = (number: number) => {
  if (locked.value) return;
  if (resetOnNext.value) {
    inputNumber.value = "0";
  }
  resetOnNext.value = false;
  inputNumber.value += number.toString();
};
const deleteOnClick = () => {
  inputNumber.value = inputNumber.value.slice(0, -1);
};

const alwaysTwoDigits = (number: number) => {
  if (Number.isNaN(number)) return "00";
  return number < 10 ? `0${number}` : number;
};
</script>

<template>
  <div class="absolute top-1/2 -translate-y-1/2 left-12">
    <div class="glass">
      <div class="grid grid-cols-2 gap-2">
        <div class="col-span-2 text-center text-7xl font-primary mb-2">
          {{ alwaysTwoDigits(+inputNumber) }}
        </div>

        <button
          v-for="n in 10"
          @click="buttonOnClick(n === 10 ? 0 : n)"
          class="digitButton mx-auto"
        >
          {{ n === 10 ? 0 : n }}
        </button>
        <button @click="deleteOnClick()" class="w-8 h-8 mt-6 mx-auto">
          <svg
            width="32"
            height="32"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m12 14 2-2m0 0 2-2m-2 2-2-2m2 2 2 2M3 12l6.414 6.414a2 2 0 0 0 1.414.586H19a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-8.172a2 2 0 0 0-1.414.586L3 12Z"
            ></path>
          </svg>
        </button>
        <button
          @click="elevator.selectedFloor = +inputNumber"
          class="w-8 h-8 mt-6 mx-auto"
        >
          <svg
            width="32"
            height="32"
            class="fill-green-600"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M12.352 18.848a1.2 1.2 0 0 1 0-1.696L17.503 12l-5.151-5.152a1.2 1.2 0 1 1 1.696-1.696l6 6a1.2 1.2 0 0 1 0 1.696l-6 6a1.2 1.2 0 0 1-1.696 0Z"
              clip-rule="evenodd"
            ></path>
            <path
              fill-rule="evenodd"
              d="M5.152 18.848a1.2 1.2 0 0 1 0-1.696L10.303 12 5.152 6.848a1.2 1.2 0 0 1 1.696-1.696l6 6a1.2 1.2 0 0 1 0 1.696l-6 6a1.2 1.2 0 0 1-1.696 0Z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.digitButton {
  @apply w-14 h-14 text-2xl font-primary transition-all rounded-full border-2 border-gray-300;
  &:hover {
    @apply bg-gradient-to-r from-gray-100 to-gray-300;
  }
}
</style>
