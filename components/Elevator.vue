<script setup lang="ts">
import { useElevator } from "~/store/elevator";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
const elevator = useElevator();

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
let _ground: Mesh;
let _leftDoor: Mesh;
let _rightDoor: Mesh;
let _elevatorLight: SpotLight;
let _keyLight: PointLight;
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
  if (_leftDoor.position.z > -1.1) {
    _leftDoor.position.z -= 0.1;
    _rightDoor.position.z += 0.1;
  }
}
function closeDoor () {
  if (_leftDoor.position.z < 0.2 - 0.8) {
    _leftDoor.position.z += 0.1;
    _rightDoor.position.z -= 0.1;
  }
}
function animateObject() {
  if (_elevator) {
    _elevator.position.y = _elevatorBody.position.y - 1.3;
  }
  _elevatorLight.position.y = _elevatorBody.position.y + 1;
  _keyLight.position.y = _elevatorBody.position.y + 0.5;
  _backLight.position.y = _elevatorBody.position.y + 3;
  _fillLight.position.y = _elevatorBody.position.y + 1;
  _leftDoor.position.y = _elevatorBody.position.y - 0.3;
  _rightDoor.position.y = _elevatorBody.position.y - 0.3;
  _camera.position.y = _elevatorBody.position.y + 6;
  _chains.forEach((chain: any, index: number) => {
    chain.position.copy(_chainBody[index].position);
  });
  if (elevator.floor >= 0) {
    _chainBody[0].position.y =12 + elevator.floor * 2;
  }
  _chainBody.forEach((chain: any) => {
    chain.position.set(0, chain.position.y, 0);
  });
  _elevatorBody.position.set(0, _elevatorBody.position.y, 0);

  if (elevator.isMoving) {
    closeDoor();
  } else {
    openDoor();
  }
}
function renderLoop() {
  _world.step(1 / 60);
  _renderer.render(_scene, _camera);
  //   _cannonDebugger.update();
  animateObject();
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

  _cannonDebugger = new CannonDebugger(_scene, _world);

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
      _elevator.rotation.y = -Math.PI / 2;

      _elevator.scale.set(0.8, 0.8, 0.8);
      _scene.add(_elevator);
    }
  );

  //   create doors for the elevator
  const doorGeometry = new BoxGeometry(0.1, 2.2, 0.75);
  const doorMaterial = new MeshLambertMaterial({ color: 0x62a8ff });
  _leftDoor = new Mesh(doorGeometry, doorMaterial);
  _rightDoor = new Mesh(doorGeometry, doorMaterial);
  _leftDoor.position.set(-1, 2.5, 0.2);
  _rightDoor.position.set(-1, 2.5, -0.6);
  _scene.add(_leftDoor);
  _scene.add(_rightDoor);

  // Lights
  _keyLight = new PointLight(0xDFFDFF, 25);
  _keyLight.position.set(0, 5, 4);
  scene.add(_keyLight);
  //   scene.add(new PointLightHelper(_keyLight));

  _fillLight = new PointLight(0x84D2F6, 25);
  _fillLight.position.set(5, 5, 0);
  scene.add(_fillLight);
  //   scene.add(new PointLightHelper(_fillLight));

  _backLight = new PointLight(0xDFFDFF, 35);
  _backLight.position.set(-5, 5, 0);
  scene.add(_backLight);
  //   scene.add(new PointLightHelper(_backLight));

  // add a spot light
  _elevatorLight = new SpotLight(0xFFB96F, 1.5);
  _elevatorLight.angle = Math.PI / 3;
  _elevatorLight.penumbra = 0.5;
  _elevatorLight.distance = 3;
  scene.add(_elevatorLight);
  //   scene.add(new SpotLightHelper(_elevatorLight));

  //create chains and add to scene
  _chains = chains.map(() => {
    const boxGeometry = new BoxGeometry(0.1, 0.1, 0.1);
    const boxMaterial = new MeshLambertMaterial({ color: 0xFCFFFC });
    return new Mesh(boxGeometry, boxMaterial);
  });
  _chains.forEach((chain) => {
    _scene.add(chain);
  });

  // create ground and add to scene

  loader.load(
    "/modal/ground.gltf",
    function (gltf: {
      scene: Mesh<
        BufferGeometry<NormalBufferAttributes>,
        Material | Material[]
      >;
    }) {
      _ground = gltf.scene;
      _ground.rotation.y = -Math.PI / 2;
      _ground.position.y = -1.5;
      _scene.add(_ground);
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
  <canvas id="elevator" />
</template>
