export function getMagicText(
  getFizzBuzz: number | "fizz" | "buzz" | "fizzbuzz"
) {
  let magicText = getFizzBuzz;
  +magicText < 10 && (magicText = "0" + magicText);

  return magicText;
}
