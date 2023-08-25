<script setup lang="ts"></script>

<template>
  <div>
    <Background />
    <Elevator />
    <Controller />
    <Floor />

    <main class="absolute">
      <slot />
    </main>
  </div>
</template>
