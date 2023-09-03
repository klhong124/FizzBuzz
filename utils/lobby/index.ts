import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Mesh } from "three";
import type { Scene } from "three";

const loader = new GLTFLoader();

import lights from "./lights";

let lobby = new Mesh();
export default {
  init: function (scene: Scene) {
    loader.load("/modal/lobby.gltf", function (gltf: any) {
      lobby = gltf.scene;
      lobby.rotation.y = -Math.PI / -2;
      lobby.position.y = 2.8;
      scene.add(lobby);
    });
    this.lights.init(scene);
  },
  lights,
};
