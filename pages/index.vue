<script setup lang="ts">
import { useElevator } from "~/store/elevator";
const store = useElevator();
const { floor } = storeToRefs(store);
</script>

<template>
  <div class="glass m-12 p-8">
    <div class="font-primary text-5xl uppercase text-black">
      Fizz Buzz Elevator
    </div>
    <p class="text-xl mt-4">by Ryan Kwan</p>
  </div>
</template>

<style lang="scss">

</style>
