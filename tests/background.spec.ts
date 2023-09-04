import { setActivePinia, createPinia } from "pinia";
import { createTestingPinia } from "@pinia/testing";
import { mount } from "@vue/test-utils";
import Background from "@/components/Background.vue";
import WindyBackground from "@/components/WindyBackground.vue";
import { getMagicText } from "./mocks/getMagicText";
import { useElevator } from "@/store/elevator";

describe("Background component", () => {
  const pinia = createTestingPinia({
    initialState: {
      floor: 10,
      selectedFloor: 0,
    },
  });

  const wrapper = mount(Background, {
    global: {
      plugins: [pinia],
      components: {
        WindyBackground: WindyBackground,
      },
    },
  });

  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("mount component with windy background", () => {
    expect(wrapper).toBeTruthy();
    expect(wrapper.findComponent(WindyBackground).exists()).toBe(true);
    const hiddenBackground = wrapper.find({ ref: "hiddenBackground" });
    expect(hiddenBackground.exists()).toBe(true);
    expect(hiddenBackground.classes()).toContain("opacity-0");
  });

  it("MagicText changed when getFizzBuzz return Fizz", () => {
    const elevator = useElevator();
    elevator.selectedFloor = 3;
    elevator.floor = elevator.selectedFloor;
    expect(elevator.floor).toBe(3);
    expect(elevator.isJustNumber).toBe(false);
    expect(getMagicText(elevator.getFizzBuzz)).toBe("fizz");
  });

  it("MagicText changed when getFizzBuzz return Buzz", () => {
    const elevator = useElevator();
    elevator.selectedFloor = 5;
    elevator.floor = elevator.selectedFloor;
    expect(elevator.floor).toBe(5);
    expect(elevator.isJustNumber).toBe(false);
    expect(getMagicText(elevator.getFizzBuzz)).toBe("buzz");
  });

  it("MagicText changed when getFizzBuzz return FizzBuzz", () => {
    const elevator = useElevator();
    elevator.selectedFloor = 15;
    elevator.floor = elevator.selectedFloor;
    expect(elevator.floor).toBe(15);
    expect(elevator.isJustNumber).toBe(false);
    expect(getMagicText(elevator.getFizzBuzz)).toBe("fizzbuzz");
  });

  it("MagicText changed when getFizzBuzz return number", () => {
    const elevator = useElevator();
    elevator.selectedFloor = 1;
    elevator.floor = elevator.selectedFloor;
    expect(elevator.floor).toBe(1);
    expect(elevator.isJustNumber).toBe(true);
    expect(getMagicText(elevator.getFizzBuzz)).toBe("01");
  });
});
