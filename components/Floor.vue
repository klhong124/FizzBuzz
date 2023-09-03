<script setup lang="ts">
import { useElevator } from "~/store/elevator";
const elevator = useElevator();
const { floor } = storeToRefs(elevator);
const isMovingUp = computed(() => elevator.isMovingUp);
const isMovingDown = computed(() => elevator.isMovingDown);
const isMoving = computed(() => elevator.isMoving);
const floors = ref();

import { ELEVATOR_SPEED } from "@/utils/constants";

watch(isMoving, (bool) => {
  bool && elevator.operate();
});


const shift = (direction: 'up' | 'down') => {
  const className = direction === 'down' ? "shiftDown" : "shift";
  floors.value.classList.add(className);
  setTimeout(() => {
    floors.value.classList.remove(className);
  }, ELEVATOR_SPEED * 0.9);
};

watch(isMovingUp, (bool) => {
  !bool && shift('up');
});

watch(isMovingDown, (bool) => {
  !bool && shift('down');
});

watch(floor, () => {
  isMovingUp.value && shift('up');
  isMovingDown.value && shift('down');
});
</script>

<template>
  <div
    class="absolute right-0 max-h-screen overflow-hidden flex flex-col justify-center"
  >
    <div
      ref="floors"
      :style="{ 
        animationDuration: ELEVATOR_SPEED * 0.9 + 'ms' }"
    >
      <div v-for="n in 7">
        <div
          class="level"
          :class="{
            current: n === 4 && !isMoving,
          }"
          @click="elevator.selectedFloor = floor + (4 - n)"
          v-if="floor + (4 - n) >= 0"
        >
          {{ floor + (4 - n) || "G" }}
        </div>
        <div v-else class="h-[300px]"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.level {
  @apply cursor-pointer h-[300px] flex justify-end items-center pr-20 hover:pr-24 transition-all text-[160px] uppercase font-bold text-gray-500 opacity-70 font-primary;

  &::before {
    @apply w-8 h-4 bg-gray-500 absolute right-0 content-[''];
  }

  &.current {
    @apply text-highlight opacity-100 text-[200px] pr-24;
    &::before {
      @apply bg-highlight;
    }
  }
}

@keyframes shift {
  from {
    transform: translateY(-300px);
  }
  to {
    transform: translateY(0);
  }
}
@keyframes shiftDown {
  from {
    transform: translateY(300px);
  }
  to {
    transform: translateY(0);
  }
}

.shift {
  animation-name: shift;
}
.shiftDown {
  animation-name: shiftDown;
}
</style>
