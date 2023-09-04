import { setActivePinia, createPinia } from "pinia";
import { useElevator } from "../store/elevator";

const expectedFizzBuzz = [
  0,
  1,
  2,
  "fizz",
  4,
  "buzz",
  "fizz",
  7,
  8,
  "fizz",
  "buzz",
  11,
  "fizz",
  13,
  14,
  "fizzbuzz",
];

describe("Elevator Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  function skipElevatorOperate() {
    // this is a replacement for await elevator.operate();
    const elevator = useElevator();
    elevator.floor = elevator.selectedFloor;
  }

  it("Elevator store init", () => {
    const elevator = useElevator();
    expect(elevator.floor).toBe(0);
    expect(elevator.selectedFloor).toBe(0);
  });

  it("when user select floor, elevator should move", async () => {
    const elevator = useElevator();
    elevator.selectedFloor = 1;
    await elevator.operate();
    expect(elevator.floor).toBe(1);
  });

  it("check FizzBuzz result for first 15 floors", async () => {
    const elevator = useElevator();
    for (let i = 0; i < 15; i++) {
      elevator.selectedFloor = i;
      skipElevatorOperate();
      expect(elevator.getFizzBuzz).toBe(expectedFizzBuzz[i]);
    }
  });

  it("check elevator is moving up", async () => {
    const elevator = useElevator();
    elevator.selectedFloor = 1;
    expect(elevator.isMovingUp).toBe(true);
  });

  it("check elevator is moving down", async () => {
    const elevator = useElevator();
    elevator.selectedFloor = 0;
    elevator.floor = 1;
    expect(elevator.isMovingDown).toBe(true);
  });

  
});
