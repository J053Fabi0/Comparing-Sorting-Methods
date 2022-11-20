export default function selección(array: number[]) {
  array = [...array];
  const { length } = array;

  for (let i = 0; i < length - 1; i++)
    for (let j = i + 1; j < length; j++) if (array[i] > array[j]) [array[i], array[j]] = [array[j], array[i]];

  return array;
}
