import {
  OrthographicCamera,
  Scene,
  PointLight,
  AmbientLight,
  WebGLRenderer,
  Mesh,
} from "three";
import {
  Body,
  Plane,
  Vec3,
  Box,
  World,
  Sphere,
  DistanceConstraint,
} from "cannon-es";

// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import type { BufferGeometry, Material, Texture, Group, Object3D } from "three";

import elevator from "./elevator";
import lobby from "./lobby";

export function useThree() {
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
    camera.position.set(15, 10, 15);
    camera.lookAt(0, 5, 0);
    const scene = new Scene();

    // Lights
    const LUMEN = 1.3;
    const ambientLight = new AmbientLight(0xffffff, LUMEN);
    scene.add(ambientLight);
    // Helpers
    // const gridHelper = new GridHelper(200, 50);
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
    const world = new World({
      gravity: new Vec3(0, -9.82, 0),
    });

    // Ground Physics
    const ground = new Body({
      shape: new Plane(),
      type: Body.STATIC,
      position: new Vec3(0, 0, 0),
    });
    ground.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(ground);

    // Elevator Physics
    const elevatorBody = new Body({
      mass: 0.1,
      shape: new Box(new Vec3(0.7, 1, 0.7)),
      position: new Vec3(0, 0, 0),
    });
    world.addBody(elevatorBody);

    // Chain Physics
    var size = 0.05;
    var dist = size * 10 + 0.2;
    var shape = new Sphere(size);
    var mass = 1.5;
    var lastChain = null;
    var N = 30;
    const chainsBody = [];
    for (var i = 0; i < N; i++) {
      // Create a new body
      var chain = new Body({ mass: i === 0 ? 0 : mass });
      chain.addShape(shape);
      chain.position.set(0, 5.5 + (N - i) * dist, 0);
      world.addBody(chain);
      // Connect this body to the last one added
      var c;
      if (lastChain !== null) {
        world.addConstraint(
          (c = new DistanceConstraint(chain, lastChain, dist))
        );
      }
      if (i === N - 1) {
        // Connect the chain to the elevator
        world.addConstraint(
          (c = new DistanceConstraint(chain, elevatorBody, 1.5))
        );
      }
      // Keep track of the lastly added body
      lastChain = chain;
      chainsBody.push(chain);
    }

    return { world, ground, elevatorBody, chainsBody };
  }



  function cameraTracking(camera: OrthographicCamera, target: Body) {
    if (target.position.y + 3 > camera.position.y) {
      camera.position.y = target.position.y + 3;
    }
    if (camera.position.y > target.position.y + 8) {
      camera.position.y = target.position.y + 8;
    }
    if (target.position.y + 5 - camera.position.y > 0.3) {
      camera.position.y += 0.01;
    }
    if (target.position.y + 5 - camera.position.y < -0.3) {
      camera.position.y -= 0.01;
    }
  }

  function cleanUpThree(scene: Scene, renderer: WebGLRenderer) {
    disposeObject(scene);
    renderer.dispose();
  }

  return {
    initThree,
    initCannon,
    cameraTracking,
    cleanUpThree,
    elevator,
    lobby,
  };
}

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
