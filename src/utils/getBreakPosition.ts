export function getBreakPosition(maxArr: string[]) {
  const breakPosition = [];

  let currentCursorPosition = 0;
  breakPosition.push(0);
  currentCursorPosition += 2;

  maxArr.forEach((x) => {
    currentCursorPosition += x.length + 1;
    breakPosition.push(currentCursorPosition);
    currentCursorPosition += 2;
  });
  return breakPosition;
}
