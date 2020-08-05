export function parserString(
  text: string
): [
  {
    [K: string]: string;
  }[],
  string[]
] {
  const rawArray = text
    .split("|")
    .map((text) => (typeof text === "string" ? text.trim() : text));
  const dataArray = rawArray.filter((i) => i);
  const length = rawArray.length - dataArray.length - 1;
  const keyLength = dataArray.length / length;
  const arr: Array<{ [K: string]: string }> = [];
  const keyArr = [];

  for (let i = 0; i < keyLength; i++) {
    keyArr.push(dataArray[i]);
  }

  for (let l = length; l-- > 1; ) {
    arr[l - 1] = {};
    for (let k = keyLength; k-- > 0; ) {
      if (typeof dataArray[k] === "undefined") {
        throw new Error("errerMessage");
      }
      let value: any;
      try {
        value = dataArray[l * keyLength + k];
      } catch (e) {
        console.error(`Eval Error: (${dataArray[l * keyLength + k]})`);
        throw e;
      }
      arr[l - 1][dataArray[k]] = value;
    }
  }

  return [arr, keyArr];
}
