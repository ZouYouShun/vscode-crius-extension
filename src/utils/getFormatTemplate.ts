import { createTemplateArray, getBreakPosition, parserString } from './';

export const space = ' ';

export function getFormatTemplate(template: string, spaceNumber: number = 4) {
  const [obj, keyArr] = parserString(template);

  const additionLength = 4 + 3 * (keyArr.length - 1);

  const maxArr = keyArr.reduce<string[]>((maxObj, key) => {
    const maxLengthString = obj.reduce<string>((prev, x) => {
      const val = x[key];
      if (val.length > prev.length) {
        return val;
      }
      return prev;
    }, key);

    maxObj.push(maxLengthString);

    return maxObj;
  }, []);

  const templateArr: string[][] = createTemplateArray(
    obj.length,
    maxArr.join('').length + additionLength,
  );

  const breakPosition = getBreakPosition(maxArr);

  // write char arr
  keyArr.forEach((key, index) => {
    for (let i = 0; i < key.length; i++) {
      const char = key[i];
      templateArr[0][breakPosition[index] + 2 + i] = char;
    }

    obj.forEach((o, objIndex) => {
      const val = o[key];

      for (let i = 0; i < val.length; i++) {
        const char = val[i];
        templateArr[1 + objIndex][breakPosition[index] + 2 + i] = char;
      }
    });
  });

  // write break |
  templateArr.forEach((t) => {
    breakPosition.forEach((position) => {
      t[position] = '|';
    });
  });

  // join result
  const resultTemplate =
    templateArr.reduce((prev, curr) => {
      prev += space.repeat(spaceNumber) + curr.join('') + '\r\n';
      return prev;
    }, '\r\n') + space.repeat(spaceNumber / 2);

  return resultTemplate;
}
