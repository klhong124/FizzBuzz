import { BoxGeometry, MeshLambertMaterial, Mesh } from "three";
import type { Scene } from "three";
import type { Body } from "cannon-es";

const doorGeometry = new BoxGeometry(0.75, 2.1, 0.1);
const doorMaterial = new MeshLambertMaterial({ color: 0x4981c6 });

import { DOORS_OPEN_SPEED } from "../constants";
const DOOR_OFFSET = 0.2;

export default {
  left: new Mesh(doorGeometry, doorMaterial),
  right: new Mesh(doorGeometry, doorMaterial),
  isSafeToOpen: false,

  init: function (scene: Scene) {
    this.left.position.set(-0.6, 2, 0.79);
    this.right.position.set(0.2, 2, 0.79);
    scene.add(this.left);
    scene.add(this.right);
  },

  open: function () {
    if (this.left.position.x > -1.1) {
      this.left.position.x -= DOORS_OPEN_SPEED;
      this.right.position.x += DOORS_OPEN_SPEED;
    }
  },
  close: function () {
    if (this.left.position.x < -0.6) {
      this.left.position.x += DOORS_OPEN_SPEED;
      this.right.position.x -= DOORS_OPEN_SPEED;
    }
  },

  operate: function () {
    if (this.isSafeToOpen) {
      this.open();
    } else {
      this.close();
    }
  },

  track: function (target: Body) {
    this.left.position.y = target.position.y - DOOR_OFFSET;
    this.right.position.y = target.position.y - DOOR_OFFSET;
  },
};
