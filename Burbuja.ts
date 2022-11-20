export default function ordenarBurbuja(array: number[]) {
  // Se hace una copia del arreglo, para no modificar el original.
  array = [...array];
  const { length } = array;

  for (let i = 0; i < length; i++)
    for (let j = 0; j < length - 1 - i; j++)
      if (array[j] > array[j + 1]) [array[j], array[j + 1]] = [array[j + 1], array[j]];

  return array;
}
