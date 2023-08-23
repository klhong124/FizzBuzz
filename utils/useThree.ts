import { PerspectiveCamera, Scene, WebGLRenderer, SpotLight } from 'three';
import type { BufferGeometry, Material, Texture, Mesh, Group, Object3D } from 'three';

function disposeObject(object: Group | Object3D) {
  if (!object) return;
  const geometries = new Map<string, BufferGeometry>();
  const materials = new Map<string, Material>();
  const textures = new Map<string, Texture>();
  object.traverse((object) => {
    const mesh = object as Mesh;
    if (mesh.isMesh) {
      const geometry = mesh.geometry 
      if (geometry) {
        geometries.set(geometry.uuid, geometry);
      }
      const material = mesh.material as any;
      if (material) {
        materials.set(material.uuid, material);
        for (const key in material) {
          const texture = material[key];
          texture?.isTexture && textures.set(texture.uuid, texture);
        }
      }
    }
  });
  for (const entry of textures) {
    entry[1].dispose();
  }
  for (const entry of materials) {
    entry[1].dispose();
  }
  for (const entry of geometries) {
    entry[1].dispose();
  }
}


export function useThree() {
  function initThree(canvasMountId: string) {
    const canvas = document.getElementById(canvasMountId)! as HTMLCanvasElement;
    const camera = new PerspectiveCamera(75, 200 / 200, 0.1, 1000);
    camera.position.set(1, 0, 1.7);
    camera.lookAt(0, 0, 0);
    const spotLight = new SpotLight('white', 0.2);
    spotLight.position.set(0.1, -1, 3);
    const scene = new Scene();
    scene.add(spotLight);
    const renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    return { scene, camera, renderer };
  }
  function cleanUpThree(scene: Scene, renderer: WebGLRenderer) {
    disposeObject(scene);
    renderer.dispose();
  }
  return {
    initThree,
    cleanUpThree,
  };
}