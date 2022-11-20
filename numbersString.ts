/** Given an integer in string format, fix its decimals. */
export function toFixedString(string: string | number | BigInt, decimals: number) {
  string = string.toString();
  const indexOfDot = string.indexOf(".");
  if (indexOfDot === -1) return string.toString();
  const intPart = string.substring(0, indexOfDot);
  if (decimals === 0) return intPart;
  const decimalPart = string.substring(indexOfDot + 1, indexOfDot + 1 + decimals);
  return intPart + "." + decimalPart;
}

/** Move the "." decimal point of a number in string format. The position could be negative or positive. */
export function moveDecimalDotString(string: string | number | BigInt, positions: number) {
  string = string.toString();
  if (positions === 0) return string.toString();
  const indexOfDot = string.indexOf(".");
  const intPart = indexOfDot === -1 ? string : string.substring(0, indexOfDot);
  const decimalPart = indexOfDot === -1 ? "" : string.substring(indexOfDot + 1, string.length);

  if (positions > 0) {
    return (
      intPart +
      decimalPart.substring(0, positions) +
      (positions >= decimalPart.length ? "" : ".") +
      decimalPart.substring(positions, decimalPart.length) +
      (positions >= decimalPart.length ? "0".repeat(positions - decimalPart.length) : "")
    );
  } else {
    return (
      intPart.substring(0, intPart.length + positions) +
      (intPart.length <= Math.abs(positions) ? `0.${"0".repeat(Math.abs(positions) - intPart.length)}` : ".") +
      intPart.substring(intPart.length + positions, intPart.length) +
      decimalPart
    );
  }
}

/** Given a string with usless 0 after the decimal point, it removes them. */
export function leading0s(n: string | number) {
  let s = n.toString();
  if (/\./.test(s)) {
    s = s.replace(/(0+)$/g, "");
    if (s.charAt(s.length - 1) === ".") s = s.substr(0, s.length - 1);
  }
  return s;
}

/** It adds commas to any number. 1000 -> 1,000. */
export const numberWithCommas = (x: string | number | BigInt) =>
  x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");

// console.log(moveDecimalDotString("123.4567", 5)); // 12345670
// console.log(moveDecimalDotString("123.4567", 4));
// console.log(moveDecimalDotString("123.4567", 3));
// console.log(moveDecimalDotString("123.4567", 2));
// console.log(moveDecimalDotString("123.4567", 1));
// console.log(moveDecimalDotString("123.4567", 0));
// console.log(moveDecimalDotString("123.4567", -1));
// console.log(moveDecimalDotString("123.4567", -2));
// console.log(moveDecimalDotString("123.4567", -3));
// console.log(moveDecimalDotString("123.4567", -4));
// console.log(moveDecimalDotString("123.4567", -5));
// console.log(moveDecimalDotString("123", 2));
// console.log(moveDecimalDotString("123", 1));
// console.log(moveDecimalDotString("123", -1));
// console.log(moveDecimalDotString("123", -2));
// console.log(moveDecimalDotString("123", -3));
// console.log(moveDecimalDotString("123", -4));

// console.log(toFixedString("1.9999999999999999", 0));

// console.log(moveDecimalDotString(0.000001, 9));
