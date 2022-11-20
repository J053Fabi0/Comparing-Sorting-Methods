export default function mergeSort(items: number[]): number[] {
  if (items.length < 2) return items;

  const middle = Math.floor(items.length / 2);
  const left = items.slice(0, middle);
  const right = items.slice(middle);

  return merge(mergeSort(left), mergeSort(right));
}

function merge(left: number[], right: number[]) {
  let iLeft = 0;
  let iRight = 0;
  const result: number[] = [];

  while (iLeft < left.length && iRight < right.length) {
    if (left[iLeft] < right[iRight]) {
      result.push(left[iLeft++]);
    } else {
      result.push(right[iRight++]);
    }
  }

  return [...result, ...left.slice(iLeft), ...right.slice(iRight)];
}
