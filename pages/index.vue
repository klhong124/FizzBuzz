<script setup lang="ts">
import { useElevator } from '~/store/elevator'
const store = useElevator();
const { floor } = storeToRefs(store);



</script>

<template>
  <div class="glass m-12 p-8">
    <div class=" font-primary text-5xl uppercase text-black">
      Fizz Buzz Elevator
    </div>
    <p class="text-xl mt-4">by Ryan Kwan</p>
  </div>
</template>


<style lang="scss">
.glass {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}
</style>