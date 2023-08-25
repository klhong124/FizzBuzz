import * as THREE from "three";
import {
  OrthographicCamera,
  Scene,
  WebGLRenderer,
  PointLightHelper,
  GridHelper,
} from "three";
import * as CANNON from "cannon-es";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import type {
  BufferGeometry,
  Material,
  Texture,
  Mesh,
  Group,
  Object3D,
} from "three";

function disposeObject(object: Group | Object3D) {
  if (!object) return;
  const geometries = new Map<string, BufferGeometry>();
  const materials = new Map<string, Material>();
  const textures = new Map<string, Texture>();
  object.traverse((object) => {
    const mesh = object as Mesh;
    if (mesh.isMesh) {
      const geometry = mesh.geometry;
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

export function useThree () {  
  function initThree(canvasMountId: string) {
    const width = window.innerWidth;
    const height = window.innerHeight;


    // Camera
    const camera = new OrthographicCamera(
      width / -200,
      width / 200,
      height / 200,
      height / -200,
      1,
      1000
    );
    camera.position.set(15, 8, 15);
    camera.lookAt(0, 2, 0);
    const scene = new Scene();

  
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    // Helpers
    const gridHelper = new GridHelper(200, 50);
    // scene.add(gridHelper);

    // Renderer
    const renderer = new WebGLRenderer({
      canvas: document.getElementById(canvasMountId)! as HTMLCanvasElement,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);

    // Resize
    window.addEventListener("resize", () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.left = width / -200;
      camera.right = width / 200;
      camera.top = height / 200;
      camera.bottom = height / -200;
      camera.updateProjectionMatrix();
    });

  

    // Controls
    // const controls = new OrbitControls(camera, renderer.domElement);

    return { scene, camera, renderer };
  }

  function initCannon() {
    // Physics World
    const world = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0),
    });

    // Ground Physics
    const ground = new CANNON.Body({
      shape: new CANNON.Plane(),
      type: CANNON.Body.STATIC,
      position: new CANNON.Vec3(0, 0, 0),
    });
    ground.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(ground);

    // Elevator Physics
    const elevator = new CANNON.Body({
      mass: 0.1,
      shape: new CANNON.Box(new CANNON.Vec3(0.7, 1, 0.7)),
      position: new CANNON.Vec3(0, 0, 0),
    });
    world.addBody(elevator);

    // Chain Physics
    var size = 0.05;
    var dist = size * 10 + 0.2;
    var shape = new CANNON.Sphere(size);
    var mass = 1.5;
    var lastChain = null;
    var N = 30
    const chains = [];
    for (var i = 0; i < N; i++) {
      // Create a new body
      var chain = new CANNON.Body({ mass: i === 0 ? 0 : mass });
      chain.addShape(shape);
      chain.position.set(0, 3 + (N - i) * dist, 0);
      world.addBody(chain);
      // Connect this body to the last one added
      var c;
      if (lastChain !== null) {
        world.addConstraint(
          (c = new CANNON.DistanceConstraint(chain, lastChain, dist))
        );
      }
      if (i === N - 1) {
        // Connect the chain to the elevator
        world.addConstraint(
          (c = new CANNON.DistanceConstraint(chain, elevator, 1.5))
        );
      }
      // Keep track of the lastly added body
      lastChain = chain;
      chains.push(chain);
    }

    return { world, ground, elevator, chains };
  }

  function cleanUpThree(scene: Scene, renderer: WebGLRenderer) {
    disposeObject(scene);
    renderer.dispose();
  }
  return {
    initThree,
    initCannon,
    cleanUpThree,
  };
}
