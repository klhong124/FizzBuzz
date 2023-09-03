import { BoxGeometry, MeshLambertMaterial, Mesh } from "three";
import type { Scene } from "three";
import type { Body } from "cannon-es";

import { useElevator } from "~/store/elevator";
const store = useElevator();

let chains: Mesh[] = [];
export default {
  init: function (scene: Scene, chainsBody: Body[]) {
    chains = chainsBody.map(() => {
      const boxGeometry = new BoxGeometry(0.1, 0.1, 0.1);
      const boxMaterial = new MeshLambertMaterial({ color: 0x535453 });
      return new Mesh(boxGeometry, boxMaterial);
    });
    chains.forEach((chain) => {
      scene.add(chain);
    });
  },

  track: function (target: Body[]) {
    chains.forEach((chain: any, index: number) => {
      chain.position.copy(target[index].position);
    });
    if (store.floor >= 0) {
      target[0].position.y = 25 + store.floor * 3;
    }

  },
};
