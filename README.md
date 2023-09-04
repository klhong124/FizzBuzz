# FizzBuzz

Welcome to FizzBuzz Elevator, To see the actual code and interact with the live demo, you can visit the provided link:  [FizzBuzz Elevator Demo](https://fizz-buzz-elevator.vercel.app).



## FizzBuzz Rules
This web application implements the classic FizzBuzz problem.
- If the number is not divisible by either 3 or 5 return the number
- If the number is divisible by 3 return Fizz
- If the number is divisible by 5 return Buzz
- If the number is divisible by both return FizzBuzz

## Tech stack
- ThreeJS
- Vitest
- TailwindCSS
- Nuxt3
- Pinia

## About the application
In this system, user may select a floor either by typing a number into an input field or using a control panel, the number will be process with `getFizzBuzz()` function and the result will be printed in the background.


## Code Base Location

### FizzBuzz Function
The code for the FizzBuzz functionality can be found in the [store/elevator.ts](https://github.com/klhong124/FizzBuzz/blob/main/store/elevator.ts) file within the project's codebase.

### Result Output Handler

For the result handler, please go to [component/Background.vue](https://github.com/klhong124/FizzBuzz/blob/main/components/Background.vue). The result will be triggered every time when the elevator stopped.

### Unit Testing
The unit testing files are located in the [/tests](https://github.com/klhong124/FizzBuzz/tree/main/tests) folder.

### UI with ThreeJS
If you are interested in how the UI is implemented, please check the [component/Elevator.vue](https://github.com/klhong124/FizzBuzz/blob/main/components/Elevator.vue) as well as the files located in [/utils](https://github.com/klhong124/FizzBuzz/tree/main/utils) directory.
The code is structured using Object-Oriented Design (OOD) programming principles to maintain cleanliness and simplicity.





