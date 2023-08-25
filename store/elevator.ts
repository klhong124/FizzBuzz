/* eslint-disable react-hooks/rules-of-hooks */
import { defineStore } from "pinia";
export const useElevator = defineStore("elevator", {
  state: () => ({
    floor: 0 as number,
    selectedFloor: 0 as number,
  }),
  actions: {
    async operate() {
      while (true) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        if (this.isMovingUp) {
          this.floor++;
        } else if (this.isMovingDown) {
          this.floor--;
        } else {
          break;
        }
      }
    },
  },
  getters: {
    isMoving: (state) => state.floor !== state.selectedFloor,
    isMovingUp: (state) => state.floor < state.selectedFloor,
    isMovingDown: (state) => state.floor > state.selectedFloor,
    getFizzBuzz: (state) => {
      if (state.floor === 0) return state.floor;
      if (state.floor % 3 === 0 && state.floor % 5 === 0) {
        return "FizzBuzz";
      }
      if (state.floor % 3 === 0) {
        return "Fizz";
      }
      if (state.floor % 5 === 0) {
        return "Buzz";
      }
      return state.floor;
    },
  },
});
