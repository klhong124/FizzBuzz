<script setup lang="ts">
import { useThree } from "@/utils/useThree";
import { DOOR_OPEN_TIMEOUT } from "@/utils/constants";
import type { Body, World } from "cannon-es";
import { OrthographicCamera, Scene, WebGLRenderer } from "three";
const { initThree, cleanUpThree, initCannon, cameraTracking, elevator, lobby } =
  useThree();

let _scene: Scene;
let _camera: OrthographicCamera;
let _renderer: WebGLRenderer;
let _renderLoopId: number;
let _world: World;
let _elevatorBody: Body;
let _chainsBody: Body[];

import { useElevator } from "~/store/elevator";
const store = useElevator();
const isMoving = computed(() => store.isMoving);

// safe to open door means a second after the elevator is stopped
let awaitDoorOpen: NodeJS.Timeout = setTimeout(() => {
  elevator.doors.isSafeToOpen = true;
}, DOOR_OPEN_TIMEOUT);

watch(isMoving, (moving) => {
  if (!moving) {
    awaitDoorOpen = setTimeout(() => {
      elevator.doors.isSafeToOpen = true;
    }, DOOR_OPEN_TIMEOUT);
  } else {
    clearTimeout(awaitDoorOpen);
    elevator.doors.isSafeToOpen = false;
  }
});

// import CannonDebugger from "cannon-es-debugger";
// let _cannonDebugger: { update: () => void };

function physicStabilization() {
  _elevatorBody.position.set(0, _elevatorBody.position.y, 0);
  _chainsBody.forEach((chain: Body) => {
    chain.position.set(0, chain.position.y, 0);
  });
}

function renderLoop() {
  _world.step(1 / 60);
  _renderer.render(_scene, _camera);
  cameraTracking(_camera, _elevatorBody);
  elevator.track(_elevatorBody, _chainsBody);
  elevator.doors.operate();
  physicStabilization();
  _renderLoopId = requestAnimationFrame(renderLoop);
  // _cannonDebugger.update();
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
  if (document.getElementById("elevator")) {
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
