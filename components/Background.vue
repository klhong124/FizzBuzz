<script setup lang="ts">
import { useElevator } from '~/store/elevator'
const store = useElevator();

</script>
<template>
    <div class="absolute  w-full max-h-[100vh] overflow-hidden">


        <div class="  h-[150vh] bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-100 to-gray-900 transition-all duration-700"
            :class="{ '-translate-y-1/4': store.isMoving }">
        </div>
    </div>
</template>