import quick from "./Quick.ts";
import merge from "./Merge.ts";
import shell from "./Shell.ts";
import burbuja from "./Burbuja.ts";
import selection from "./Selección.ts";
import insertion from "./Insertion.ts";
import { getSplitter } from "./SplitTime.ts";
import { numberWithCommas } from "./numbersString.ts";

const humanize = true;
const formatearMs = humanize
  ? getSplitter({ language: "es", variant: "symbols" })
  : (n: number) => (Math.round(n * 10_000) / 10_000).toString();

const log = false;

const métodos = {
  shell,
  quick,
  merge,
  inserción: insertion,
  selección: selection,
  burbuja,
};

const defaultDatos = () => ({
  ["# arreglos"]: "",
  Promedio: "",
  Max: "",
  Min: "",
  ["Tiempo total"]: "",
});

function test(generarArreglo: () => number[], seconds = 10) {
  seconds = seconds * 1000;
  const arreglos = [generarArreglo()];

  // Inicializar el objeto que contendrá todos los datos
  const datos = Object.keys(métodos).reduce(
    (obj, método) => Object.assign(obj, { [método]: defaultDatos() }),
    {}
  ) as Record<keyof typeof métodos, ReturnType<typeof defaultDatos>>;

  for (const método of Object.keys(métodos) as (keyof typeof métodos)[]) {
    if (log) console.log(`\n${método}...`);

    let i = 0;
    let min = Infinity;
    let max = -Infinity;
    let tiempoTotal = 0;
    // El for continuará mientras haya tiempo
    for (; tiempoTotal < seconds; i++) {
      // Si no hay un siguiente arreglo, generar uno.
      if (!arreglos[i]) arreglos.push(generarArreglo());

      const arreglo = arreglos[i];

      const tiempo = Date.now(); // Tomar el tiempo de inicio.
      métodos[método](arreglo); // Ordenar el arreglo.
      const tiempoFinal = Date.now() - tiempo; // Calcular el tiempo final.

      tiempoTotal += tiempoFinal; // sumar al tiempo total

      // Evaluar los tiempos mínimo y máximo
      if (tiempoFinal > max) max = tiempoFinal;
      if (tiempoFinal < min) min = tiempoFinal;
    }

    // Establecer su promedio.
    datos[método].Promedio = formatearMs(tiempoTotal / i);

    // Establecer el tiempo mínimo y máximo.
    datos[método].Min = formatearMs(min);
    datos[método].Max = formatearMs(max);

    // Establecer el tiempo total.
    datos[método]["Tiempo total"] = formatearMs(tiempoTotal);

    // Establecer el número de arreglos que logró ordenar.
    datos[método]["# arreglos"] = numberWithCommas(i);

    if (log) console.log(`${método} ${datos[método]["Tiempo total"]}`);
  }

  // Imprimir los datos en formato de tabla
  console.table(datos);
}

// Esta función genera un arreglo de "length" elementos entre min y max.
const getRandomArray = (length: number, min = 0, max = 1_000_000) =>
  new Array(length).fill(0).map(() => Math.floor(Math.random() * (max - min + 1)) + min);
// Este es el arreglo de números ordenados del 1 al 100,000
const sortedArray = new Array(100_000).fill(0).map((_, i) => i + 1);
// El mismo arreglo anterior, pero en orden inverso
const sortedArrayReverse = sortedArray.reverse();

// Estos son los tests que se ejecutarán
const tests: Array<{ title: string; generator: () => number[]; seconds?: number }> = [
  {
    title: "100 elementos al azar",
    generator: () => getRandomArray(100),
  },
  {
    title: "50,000 elementos al azar",
    generator: () => getRandomArray(50_000),
  },
  {
    title: "100,000 elementos al azar",
    generator: () => getRandomArray(100_000),
  },
  {
    title: "100,000 elementos ordenados en orden inverso",
    generator: () => sortedArrayReverse,
  },
  {
    title: "100,000 elementos ordenados",
    generator: () => sortedArray,
  },
  {
    title: "100,000 elementos que sólo pueden ser números entre el 1 y el 5",
    generator: () => getRandomArray(100_000, 1, 5),
  },
];

// Se ejecutan los tests uno a uno
for (const { title, generator, seconds } of tests) {
  console.log("\n" + title);
  test(generator, seconds);
}
