<script setup lang="ts">


</script>

<template>
  <main>
    <Background />
    <div class="absolute">
      <Elevator />
    </div>
    <Floor />
    <div class="absolute">
      <slot />
    </div>
  </main>
</template>
