<script setup lang="ts">
import { useThree } from "@/utils/useThree";
import { DOOR_OPEN_TIMEOUT } from "@/utils/constants";
import type { Body } from "cannon-es";

import { useElevator } from "~/store/elevator";
const store = useElevator();
const isMoving = computed(() => store.isMoving);

let safeToOpenDoor = false;
setTimeout(() => {
  safeToOpenDoor = true;
}, DOOR_OPEN_TIMEOUT);
watch(isMoving, (bool) => {
  if (!bool) {
    setTimeout(() => {
      safeToOpenDoor = true;
    }, DOOR_OPEN_TIMEOUT);
  } else {
    safeToOpenDoor = false;
  }
});

import {  OrthographicCamera, Scene, WebGLRenderer } from "three";
import { World } from "cannon-es";
// import CannonDebugger from "cannon-es-debugger";

let _scene: Scene;
let _camera: OrthographicCamera;
let _renderer: WebGLRenderer;
let _renderLoopId: number;
let _world: World;
let _elevatorBody: Body;
let _chainsBody: Body[];
// let _cannonDebugger: { update: () => void };
const { initThree, cleanUpThree, initCannon, cameraTracking, elevator, lobby } =
  useThree();
const canvas = computed(
  () => document.getElementById("elevator") as HTMLCanvasElement
);

function physicStabilization() {
  _elevatorBody.position.set(0, _elevatorBody.position.y, 0);
  _chainsBody.forEach((chain: Body) => {
    chain.position.set(0, chain.position.y, 0);
  });
}

function renderLoop() {
  _world.step(1 / 60);
  _renderer.render(_scene, _camera);
  //   _cannonDebugger.update();
  cameraTracking(_camera, _elevatorBody);
  elevator.track(_elevatorBody, _chainsBody);

  if (safeToOpenDoor) {
    elevator.doors.open();
  } else {
    elevator.doors.close();
  }
  physicStabilization();

  _renderLoopId = requestAnimationFrame(renderLoop);
}
function setupScene() {
  //initialize
  const { scene, camera, renderer } = initThree("elevator");
  _scene = scene;
  _camera = camera;
  _renderer = renderer;

  const { world, elevatorBody, chainsBody } = initCannon();
  _elevatorBody = elevatorBody;
  _chainsBody = chainsBody;
  _world = world;

  elevator.init(_scene, _chainsBody);
  lobby.init(_scene);
  _renderLoopId = requestAnimationFrame(renderLoop);
}
onMounted(() => {
  if (canvas.value) {
    setupScene();
  }
});
onBeforeUnmount(() => {
  cancelAnimationFrame(_renderLoopId);
  cleanUpThree(_scene, _renderer);
});
</script>

<template>
  <div class="absolute">
    <canvas id="elevator" />
  </div>
</template>
