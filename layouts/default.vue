<script setup lang="ts"></script>

<template>
  <div>
    <Background />
    <Elevator />
    <Controller />
    <Floor />
    <FloorInput />

    <main class="absolute">
      <slot />
    </main>
  </div>
</template>
