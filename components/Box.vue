<script setup lang="ts">
import { useThree } from '@/utils/useThree';
import { BoxGeometry, Mesh, MeshLambertMaterial, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
let _scene: Scene;
let _camera: PerspectiveCamera;
let _renderer: WebGLRenderer;
let _renderLoopId: number;
let _box: Mesh;
const { initThree, cleanUpThree } = useThree();
const canvas = computed(() => document.getElementById('mountId') as HTMLCanvasElement);
function animateObject() {
  //rotate object
  _box.rotation.x += 0.01;
  _box.rotation.y += 0.01;
}
function renderLoop() {
  // will keep running for every frame since
  // we keep recreate a new requestAnimationFrame at the end of the function.
  _renderer.render(_scene, _camera);
  animateObject();
  _renderLoopId = requestAnimationFrame(renderLoop);
}
function setupScene() {
  //initialize
  const { scene, camera, renderer } = initThree('mountId');
  _scene = scene;
  _camera = camera;
  _renderer = renderer;
  //create a box and add to scene
  const boxGeometry = new BoxGeometry(1, 1, 1);
  const boxMaterial = new MeshLambertMaterial({ color: 0x00ff00 });
  _box = new Mesh(boxGeometry, boxMaterial);
  _scene.add(_box);
  // start the renderLoop
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
  <canvas id="mountId" width="700" height="500" class="m-auto h-[500px] w-[700px] rounded-md" />
</template>