/* eslint-disable react-hooks/rules-of-hooks */
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
  },
});
