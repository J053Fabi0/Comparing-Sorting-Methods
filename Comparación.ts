import quick from "./Quick.ts";
import merge from "./Merge.ts";
import shell from "./Shell.ts";
import burbuja from "./Burbuja.ts";
import selection from "./Selección.ts";
import insertion from "./Insertion.ts";
import { getSplitter } from "./SplitTime.ts";
import { numberWithCommas } from "./numbersString.ts";

const splitTime = getSplitter({ language: "es", variant: "symbols" });

const log = true;

const métodos = {
  burbuja,
  selección: selection,
  inserción: insertion,
  merge,
  shell,
  quick,
};

type TodasIteraciones = Record<keyof typeof métodos, number>;
type AlgunasIteraciones = Partial<TodasIteraciones> & { default: number };
function test(generateArray: () => number[], iteraciones: number | TodasIteraciones | AlgunasIteraciones) {
  if (typeof iteraciones === "number") iteraciones = { default: iteraciones };

  // Crear todos los arreglos que serán ordenados. Se crearán el número máximo necesario según
  // las instrucciones de iteraciones
  const arreglos = new Array(Math.max(...Object.values(iteraciones))).fill(0).map(generateArray);

  // Inicializar el objeto que contendrá todos los datos
  const defaultDatos = () => ({
    promedio: "",
    max: "",
    min: "",
    ["tiempo total"]: "",
    ["# arreglos"]: "",
    tiempos: [] as number[],
  });
  const datos = Object.keys(métodos).reduce(
    (obj, método) => Object.assign(obj, { [método]: defaultDatos() }),
    {}
  ) as Record<keyof typeof métodos, ReturnType<typeof defaultDatos>>;

  for (const método of Object.keys(métodos) as (keyof typeof métodos)[]) {
    // Tomar el tiempo total de inicio
    const tiempo = Date.now();
    const slice = iteraciones[método] ?? (iteraciones as AlgunasIteraciones).default;
    if (log) console.log(`\n${método} ${slice}...`);

    // Establecer el número de arreglos que ordenará
    datos[método]["# arreglos"] = numberWithCommas(slice);

    // Iterar cada arreglo
    for (const array of arreglos.slice(0, slice)) {
      const tiempo = Date.now(); // Tomar el tiempo de inicio
      métodos[método](array); // Ordenarlo
      datos[método].tiempos.push(Date.now() - tiempo); // Añadir el tiempo al arreglo de tiempos
    }

    // Establecer el tiempo total
    datos[método]["tiempo total"] = splitTime(Date.now() - tiempo);

    // Establecer el tiempo mínimo y máximo
    datos[método].min = splitTime(
      (() => {
        let min = Infinity;
        for (const dato of datos[método].tiempos) if (dato < min) min = dato;
        return min;
      })()
    );
    datos[método].max = splitTime(
      (() => {
        let max = -Infinity;
        for (const dato of datos[método].tiempos) if (dato > max) max = dato;
        return max;
      })()
    );

    if (log) console.log(`${método} ${datos[método]["tiempo total"]}`);
  }

  // Calcular los promedios
  const promedio = (array: number[]) =>
    Math.round(array.reduce((p, c) => p + c * 1_000_000, 0) / array.length) / 1_000_000;
  for (const método of Object.keys(métodos) as (keyof typeof métodos)[])
    datos[método].promedio = splitTime(promedio(datos[método].tiempos));

  // Imprimir las estadísticas, excepto por el arreglo de tiempos
  console.table(
    datos,
    Object.keys(defaultDatos()).filter((k) => k !== "tiempos")
  );
}

const getRandomArray = (length: number, min = 0, max = 1_000_000) =>
  new Array(length).fill(0).map(() => Math.floor(Math.random() * (max - min + 1)) + min);

// 100 elementos al azar
console.log("100 elementos al azar");
test(() => getRandomArray(100), {
  default: 200_000,
  selección: 250_000,
  inserción: 550_000,
  merge: 250_000,
  shell: 1_000_000,
  quick: 450_000,
});

// 50,000 elementos al azar
// console.log("\n50,000 elementos al azar");
// test(() => getRandomArray(50_000), 1);

// 100,000 elementos al azar
// console.log("\n100,000 elementos al azar");
// test(() => getRandomArray(100_000), {
//   shell: 200,
//   merge: 100,
//   quick: 100,
//   inserción: 5,
//   selección: 1,
//   burbuja: 1,
// });

const sortedArray = new Array(100_000).fill(0).map((_, i) => i + 1);
const sortedArrayInverse = sortedArray.reverse();

// 100,000 elementos ordenados en orden inverso
// console.log("\n100,000 elementos ordenados en orden inverso");
// test(() => sortedArrayInverse, {
//   shell: 2100,
//   merge: 900,
//   quick: 3000,
//   inserción: 40,
//   selección: 2,
//   burbuja: 2,
// });

// 100,000 elementos ordenados
// console.log("\n100,000 elementos ordenados");
// test(() => sortedArray, 1);

// 100,000 elementos que sólo pueden ser números entre el 1 y el 5
// console.log("\n100,000 elementos que sólo pueden ser números entre el 1 y el 5");
// test(() => getRandomArray(100_000, 1, 5), 1);
