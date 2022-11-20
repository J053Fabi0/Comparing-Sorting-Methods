// https://en.wikipedia.org/wiki/Shellsort#Gap_sequences
// With respect to the average number of comparisons, Ciura's sequence has the best known performance
const incs = new Uint32Array([1750, 701, 301, 132, 57, 23, 10, 4, 1]);

export default function shell(srcArray: number[]): number[] {
  const array = srcArray.slice(0);
  const l = array.length;

  for (let k = 0; k < 16; k++) {
    for (let inc = incs[k], i = inc; i < l; i++) {
      const v = array[i];
      let j = i;

      while (j >= inc && array[j - inc] > v) {
        array[j] = array[j - inc];
        j -= inc;
      }

      array[j] = v;
    }
  }

  return array;
}

// const a = new Array(100_000).fill(0).map((_, i) => i);
// console.log(
//   (() => {
//     const b = shell(a);
//     return [...b.slice(0, 5), ...b.slice(-5)];
//   })()
// );
// console.log(a.slice(0, 10));

// export default function shell(array: number[], sort?: (array: number[]) => number[]) {
//   // Obtener el tamaño del arreglo
//   const { length: arrayLength } = array;
//   // Hacer una copia del arreglo paro no modificar el original.
//   array = [...array];

//   // iterar desde n hasta 1.
//   // n se inicializa con un valor tal que los primeros aux tengan máxmio 2 valores.
//   for (let n = Math.ceil(arrayLength / 2); n >= 1; n--) {
//     // Crear lista de listas.
//     const auxs: number[][] = new Array(n).fill(0).map(() => []);
//     // Popular las listas.
//     for (let i = 0; i < arrayLength; i++) auxs[i % n].push(array[i]);
//     // Ordenarlas.
//     for (const list of auxs) {
//       // por el método de sorting de elección
//       if (sort) list.splice(0, Infinity, ...sort(list));
//       // o el default si no se dio alguno
//       else list.sort((a, b) => a - b);
//     }
//     // Vaciar el arreglo.
//     array.length = 0;
//     // Combinar los aux en el arreglo.
//     const auxLength = Math.ceil(arrayLength / n);
//     for (let i = 0; i < auxLength; i++) for (const aux of auxs) if (aux[0] !== undefined) array.push(aux.shift()!);
//   }
//   return array;
// }
