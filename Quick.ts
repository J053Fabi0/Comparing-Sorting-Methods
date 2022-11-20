function partition(arrayToSort: number[], low: number, high: number) {
  const pivot = arrayToSort[Math.floor((low + high) / 2)];

  while (low <= high) {
    while (arrayToSort[low] < pivot) low++;
    while (arrayToSort[high] > pivot) high--;

    if (low <= high) {
      [arrayToSort[low], arrayToSort[high]] = [arrayToSort[high--], arrayToSort[low++]];
    }
  }
  return low;
}

function quickInline(arrayToSort: number[], low = 0, high = arrayToSort.length - 1) {
  const index = partition(arrayToSort, low, high);

  if (low < index - 1) quickInline(arrayToSort, low, index - 1);
  if (index < high) quickInline(arrayToSort, index, high);
}

export default function quick(array: number[]) {
  const a = [...array];
  quickInline(a);
  return a;
}

// export default function quick(array: number[]): number[] {
//   array = [...array];
//   if (array.length === 1) return array;

//   let decrementando = true;
//   let start = 0,
//     end = array.length - 1;

//   while (true) {
//     if (array[start] > array[end]) {
//       [array[start], array[end]] = [array[end], array[start]];
//       decrementando = !decrementando;
//     }
//     if (start + 1 !== end) {
//       if (decrementando) end--;
//       else start++;
//     } else break;
//   }

//   const part2 = array.splice(start + 1, Infinity);
//   return [...quick(array), ...quick(part2)];
// }
