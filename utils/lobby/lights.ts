import { PointLight } from "three";
import type { Scene } from "three";

export default {
  lobbyLight: new PointLight(0xffffff, 10),
  lobbyLight2: new PointLight(0xffffff, 5),

  init: function (scene: Scene) {
    this.lobbyLight.position.set(5, 6, 2);
    this.lobbyLight2.position.set(-1, 7, 4);
    scene.add(this.lobbyLight);
    scene.add(this.lobbyLight2);
  },
};
