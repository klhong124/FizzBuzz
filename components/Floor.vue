<script setup lang="ts">
import { useElevator } from "~/store/elevator";
const elevator = useElevator();
const { floor } = storeToRefs(elevator);
const isMovingUp = computed(() => elevator.isMovingUp);
const isMovingDown = computed(() => elevator.isMovingDown);
const isMoving = computed(() => elevator.isMoving);
const floors = ref();

watch(isMoving, (bool) => {
  bool && elevator.operate();
});

const shiftDown = () => {
  floors.value.classList.add("shiftDown");
  setTimeout(() => {
    floors.value.classList.remove("shiftDown");
  }, 160);
};

const shiftUp = () => {
  floors.value.classList.add("shiftUp");
  setTimeout(() => {
    floors.value.classList.remove("shiftUp");
  }, 160);
};

watch(isMovingUp, (bool) => {
  !bool && shiftUp();
});

watch(isMovingDown, (bool) => {
  !bool && shiftDown();
});

watch(floor, () => {
  isMovingUp.value && shiftUp();
  isMovingDown.value && shiftDown();
});
</script>

<template>
  <div
    class="absolute right-0 max-h-screen overflow-hidden flex flex-col justify-center"
  >
    <div ref="floors">
      <div v-for="n in 7">
        <div
          class="level"
          :class="{
            current: n === 4,
          }"
          @click="elevator.selectedFloor = floor + (4 - n)"
          v-if="floor + (4 - n) >= 0"
        >
          {{ floor + (4 - n) || 'G' }}
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
    @apply w-8 h-4 bg-gray-500 absolute right-0;
    content: "";
  }

  &.current {
    @apply text-highlight opacity-100 text-[200px] pr-24;
    &::before {
      @apply bg-highlight;
    }
  }
}

@keyframes shiftUp {
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

.shiftUp {
  animation: shiftUp 0.15s ease-in-out;
}
.shiftDown {
  animation: shiftDown 0.15s ease-in-out;
}
</style>
