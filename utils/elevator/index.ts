import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Mesh } from "three";
import type { Scene } from "three";
import type { Body } from "cannon-es";

const loader = new GLTFLoader();
import doors from "./doors";
import lights from "./lights";
import chains from "./chains";

let elevator = new Mesh();
export default {
  init: function (scene: Scene, chainsBody: Body[]) {
    loader.load("/modal/elevator.gltf", function (gltf: any) {
      elevator = gltf.scene;
      elevator.rotation.y = Math.PI / 2;
      elevator.scale.set(0.8, 0.8, 0.8);
      scene.add(elevator);
    });
    this.doors.init(scene);
    this.lights.init(scene);
    this.chains.init(scene, chainsBody);
  },

  track: function (target: Body, chainTarget: Body[]) {
      elevator.position.y = target.position.y - 1.3;
      this.doors.track(target);
      this.lights.track(target);
      this.chains.track(chainTarget);
  },

  doors,
  lights,
  chains,
};
