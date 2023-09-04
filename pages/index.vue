<script setup lang="ts">
import { useElevator } from "~/store/elevator";
const store = useElevator();
const { floor } = storeToRefs(store);
</script>

<template>
  <div class="glass m-8 p-4 ">
    <div class="font-primary text-3xl uppercase text-black">
      Fizz Buzz Elevator
    </div>
    <p class="mt-3">created by <a href="https://ryankwan.vercel.app/" target="_blank" class="underline">Ryan Kwan</a> | <a href="https://github.com/klhong124/FizzBuzz" target="_blank" class="underline">GitHub Source Code</a></p>
  </div>
</template>

<style lang="scss">

</style>
