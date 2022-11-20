export default function insertion(array: number[]) {
  array = [...array];
  const sorted = array.splice(0, 2);
  const { length } = array;

  // se le da nombre al for para poder continuarlo dentro de otro for anidado
  mainFor: for (let i = 0; i < length; i++) {
    const elemento = array[i];
    const sortedLength = sorted.length;

    // iteramos cada elemento del sort para saber dónde se puede insertar el elemento
    for (let j = 0; j < sortedLength; j++) {
      if (elemento < sorted[j]) {
        // añadir el elemento en la posición
        sorted.splice(j, 0, elemento);
        // continuar el mainFor, no dejar que se ejecute el sorted.push
        continue mainFor;
      }
    }

    // si no se hizo un continue quiere decir que no se insertó nada y se debe añadir al final
    sorted.push(elemento);
  }

  return sorted;
}
