export function createTemplateArray(row: number, column: number) {
  const templateArr: string[][] = [];

  for (let i = 0; i < row + 1; i++) {
    templateArr.push([]);

    for (let j = 0; j < column; j++) {
      templateArr[i].push(" ");
    }
  }
  return templateArr;
}
