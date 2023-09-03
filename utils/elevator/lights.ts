import { PointLight, SpotLight } from "three";
import type { Scene } from "three";
import type { Body } from "cannon-es";

export default {
  keyLight: new PointLight(0xffffff, 80),
  fillLight: new PointLight(0xffffff, 50),
  backLight: new PointLight(0xdffdff, 20),
  elevatorLight: new SpotLight(0xffffff, 4),

  init: function (scene: Scene) {
    this.keyLight.position.set(3, 6, 14);
    this.fillLight.position.set(11, 5, 4);
    this.backLight.position.set(-15, 5, -2);
    this.elevatorLight.angle = Math.PI / 3;
    this.elevatorLight.penumbra = 0.5;
    this.elevatorLight.distance = 3;
    scene.add(this.keyLight);
    scene.add(this.fillLight);
    scene.add(this.backLight);
    scene.add(this.elevatorLight);
  },

  track: function (target: Body) {
    this.keyLight.position.y = target.position.y + 6;
    this.fillLight.position.y = target.position.y + 3;
    this.backLight.position.y = target.position.y + 3;
    this.elevatorLight.position.y = target.position.y + 1;
  },
};
