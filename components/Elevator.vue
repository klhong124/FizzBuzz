<script setup lang="ts">
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import { useElevator } from "~/store/elevator";
const elevator = useElevator();
let safeToOpenDoor = false;
setTimeout(() => {
  safeToOpenDoor = true;
}, 1500);
const isMoving = computed(() => elevator.isMoving);
watch(isMoving, (bool) => {
  if (!bool) {
    setTimeout(() => {
      safeToOpenDoor = true;
    }, 1500);
  } else {
    safeToOpenDoor = false;
  }
});
import { useThree } from "@/utils/useThree";
import {
  BoxGeometry,
  BufferGeometry,
  Material,
  Mesh,
  MeshLambertMaterial,
  NormalBufferAttributes,
  OrthographicCamera,
  SpotLight,
  PointLight,
  SpotLightHelper,
  PointLightHelper,
  Scene,
  WebGLRenderer,
} from "three";
import { World } from "cannon-es";
import CannonDebugger from "cannon-es-debugger";

let _scene: Scene;
let _camera: OrthographicCamera;
let _renderer: WebGLRenderer;
let _renderLoopId: number;
let _elevator: Mesh;
let _lobby: Mesh;
let _leftDoor: Mesh;
let _rightDoor: Mesh;
let _elevatorLight: SpotLight;
let _keyLight: PointLight;
let _lobbyLight: PointLight;
let _lobbyLight2: PointLight;
let _fillLight: PointLight;
let _backLight: PointLight;
let _world: World;
let _elevatorBody: any;
let _chains: Mesh[];
let _chainBody: any[];
let _cannonDebugger: { update: () => void };
const { initThree, cleanUpThree, initCannon } = useThree();
const canvas = computed(
  () => document.getElementById("elevator") as HTMLCanvasElement
);
function openDoor() {
  if (_leftDoor.position.x > -1.1) {
    _leftDoor.position.x -= 0.1;
    _rightDoor.position.x += 0.1;
  }
}
function closeDoor() {
  if (_leftDoor.position.x < 0.2 - 0.8) {
    _leftDoor.position.x += 0.1;
    _rightDoor.position.x -= 0.1;
  }
}

function cameraMovement() {
  if (_elevatorBody.position.y + 3 > _camera.position.y) {
    _camera.position.y = _elevatorBody.position.y + 3;
  }
  if (_camera.position.y > _elevatorBody.position.y + 8) {
    _camera.position.y = _elevatorBody.position.y + 8;
  }
  if (_elevatorBody.position.y + 6 - _camera.position.y > 0.3) {
    _camera.position.y += 0.01;
  }
  if (_elevatorBody.position.y + 6 - _camera.position.y < -0.3) {
    _camera.position.y -= 0.01;
  }
}

function LightPlacement() {
  _keyLight.position.y = _elevatorBody.position.y + 6;
  _backLight.position.y = _elevatorBody.position.y + 3;
  _fillLight.position.y = _elevatorBody.position.y + 3;
}

function elevatorAnimation() {
  if (_elevator) {
    _elevator.position.y = _elevatorBody.position.y - 1.3;
  }
  _elevatorLight.position.y = _elevatorBody.position.y + 1;

  _leftDoor.position.y = _elevatorBody.position.y - 0.2;
  _rightDoor.position.y = _elevatorBody.position.y - 0.2;

  if (safeToOpenDoor) {
    openDoor();
  } else {
    closeDoor();
  }
  _elevatorBody.position.set(0, _elevatorBody.position.y, 0);
}

function chainAnimation() {
  _chains.forEach((chain: any, index: number) => {
    chain.position.copy(_chainBody[index].position);
  });
  if (elevator.floor >= 0) {
    _chainBody[0].position.y = 25 + elevator.floor * 4.5;
  }
  _chainBody.forEach((chain: any) => {
    chain.position.set(0, chain.position.y, 0);
  });
}
function renderLoop() {
  _world.step(1 / 60);
  _renderer.render(_scene, _camera);
  //   _cannonDebugger.update();
  elevatorAnimation();
  chainAnimation();
  cameraMovement();
  LightPlacement();

  _renderLoopId = requestAnimationFrame(renderLoop);
}
function setupScene() {
  //initialize
  const { scene, camera, renderer } = initThree("elevator");
  _scene = scene;
  _camera = camera;
  _renderer = renderer;

  const { world, elevator, chains } = initCannon();
  _elevatorBody = elevator;
  _chainBody = chains;
  _world = world;

  _camera.position.y = _elevatorBody.position.y + 11

  //   _cannonDebugger = new CannonDebugger(_scene, _world);

  //create elevator and add to scene
  const loader = new GLTFLoader();
  loader.load(
    "/modal/elevator.gltf",
    function (gltf: {
      scene: Mesh<
        BufferGeometry<NormalBufferAttributes>,
        Material | Material[]
      >;
    }) {
      _elevator = gltf.scene;
      _elevator.rotation.y = Math.PI / 2;
      _elevator.scale.set(0.8, 0.8, 0.8);
      _scene.add(_elevator);
    }
  );

  //   create doors for the elevator
  const doorGeometry = new BoxGeometry(0.75, 2.1, 0.1);
  const doorMaterial = new MeshLambertMaterial({ color:0x4981C6 });
  _leftDoor = new Mesh(doorGeometry, doorMaterial);
  _rightDoor = new Mesh(doorGeometry, doorMaterial);

  _leftDoor.position.set(-0.6, 2, 0.79);
  _rightDoor.position.set(0.2, 2, 0.79);
  _scene.add(_leftDoor);
  _scene.add(_rightDoor);

  // Lights
  _keyLight = new PointLight(0xffffff, 80);
  _keyLight.position.set(3, 6, 14);
  scene.add(_keyLight);
  // scene.add(new PointLightHelper(_keyLight));

  _fillLight = new PointLight(0xffffff, 50);
  _fillLight.position.set(11, 5, 4);
  scene.add(_fillLight);
  // scene.add(new PointLightHelper(_fillLight));

  _backLight = new PointLight(0xdffdff, 20);
  _backLight.position.set(-15, 5, -2);
  scene.add(_backLight);
  // scene.add(new PointLightHelper(_backLight));

  _lobbyLight = new PointLight(0xffffff, 10);
  _lobbyLight.position.set(5, 6, 2);
  scene.add(_lobbyLight);
  // scene.add(new PointLightHelper(_lobbyLight));

  _lobbyLight2 = new PointLight(0xffffff, 5);
  _lobbyLight2.position.set(-1, 7, 4);
  scene.add(_lobbyLight2);
  // scene.add(new PointLightHelper(_lobbyLight2));

  // add a spot light
  _elevatorLight = new SpotLight(0xffffff, 4);
  _elevatorLight.angle = Math.PI / 3;
  _elevatorLight.penumbra = 0.5;
  _elevatorLight.distance = 3;
  scene.add(_elevatorLight);
  // scene.add(new SpotLightHelper(_elevatorLight));

  //create chains and add to scene
  _chains = chains.map(() => {
    const boxGeometry = new BoxGeometry(0.1, 0.1, 0.1);
    const boxMaterial = new MeshLambertMaterial({ color: 0xfcfffc });
    return new Mesh(boxGeometry, boxMaterial);
  });
  _chains.forEach((chain) => {
    _scene.add(chain);
  });

  // create lobby and add to scene

  loader.load(
    "/modal/lobby.gltf",
    function (gltf: {
      scene: Mesh<
        BufferGeometry<NormalBufferAttributes>,
        Material | Material[]
      >;
    }) {
      _lobby = gltf.scene;
      _lobby.rotation.y = -Math.PI / -2;
      _lobby.position.y = 2.8;
      _scene.add(_lobby);
    }
  );

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
