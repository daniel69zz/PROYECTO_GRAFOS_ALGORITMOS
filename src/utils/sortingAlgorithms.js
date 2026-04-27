const shouldSwap = (left, right, order) =>
  order === "asc" ? left > right : left < right;

const shouldComeBefore = (left, right, order) =>
  order === "asc" ? left < right : left > right;

const snapshotStep = (type, array, indices, description) => ({
  type,
  array: [...array],
  indices,
  description,
});

export const SORT_ALGORITHMS = {
  selection: "Selection Sort",
  insertion: "Insertion Sort",
  merge: "Merge Sort",
  shell: "Shell Sort",
};

export function buildSortingSteps(inputArray, algorithm, order = "asc") {
  const array = [...inputArray];

  switch (algorithm) {
    case "selection":
      return selectionSortSteps(array, order);
    case "insertion":
      return insertionSortSteps(array, order);
    case "merge":
      return mergeSortSteps(array, order);
    case "shell":
      return shellSortSteps(array, order);
    default:
      return [];
  }
}

function selectionSortSteps(array, order) {
  const steps = [];

  for (let i = 0; i < array.length - 1; i += 1) {
    let selectedIndex = i;

    for (let j = i + 1; j < array.length; j += 1) {
      steps.push(
        snapshotStep(
          "compare",
          array,
          [selectedIndex, j],
          `Comparando ${array[selectedIndex]} y ${array[j]}`,
        ),
      );

      if (shouldComeBefore(array[j], array[selectedIndex], order)) {
        selectedIndex = j;
        steps.push(
          snapshotStep(
            "select",
            array,
            [selectedIndex],
            `Seleccionando ${array[selectedIndex]} como candidato`,
          ),
        );
      }
    }

    if (selectedIndex !== i) {
      const left = array[i];
      const right = array[selectedIndex];
      [array[i], array[selectedIndex]] = [array[selectedIndex], array[i]];
      steps.push(
        snapshotStep(
          "swap",
          array,
          [i, selectedIndex],
          `Intercambiando ${left} con ${right}`,
        ),
      );
    }
  }

  steps.push(snapshotStep("done", array, [], "Arreglo ordenado"));
  return steps;
}

function insertionSortSteps(array, order) {
  const steps = [];

  for (let i = 1; i < array.length; i += 1) {
    const key = array[i];
    let j = i - 1;

    steps.push(
      snapshotStep("select", array, [i], `Insertando ${key} en la posicion ${i}`),
    );

    while (j >= 0 && shouldSwap(array[j], key, order)) {
      steps.push(
        snapshotStep(
          "compare",
          array,
          [j, j + 1],
          `Comparando ${array[j]} y ${key}`,
        ),
      );
      array[j + 1] = array[j];
      steps.push(
        snapshotStep(
          "move",
          array,
          [j, j + 1],
          `Moviendo ${array[j]} a la posicion ${j + 1}`,
        ),
      );
      j -= 1;
    }

    array[j + 1] = key;
    steps.push(
      snapshotStep(
        "insert",
        array,
        [j + 1],
        `Insertando ${key} en la posicion ${j + 1}`,
      ),
    );
  }

  steps.push(snapshotStep("done", array, [], "Arreglo ordenado"));
  return steps;
}

function mergeSortSteps(array, order) {
  const steps = [];

  const merge = (left, middle, right) => {
    const leftArray = array.slice(left, middle + 1);
    const rightArray = array.slice(middle + 1, right + 1);
    let i = 0;
    let j = 0;
    let k = left;

    while (i < leftArray.length && j < rightArray.length) {
      steps.push(
        snapshotStep(
          "compare",
          array,
          [left + i, middle + 1 + j],
          `Comparando ${leftArray[i]} y ${rightArray[j]}`,
        ),
      );

      if (shouldComeBefore(leftArray[i], rightArray[j], order) || leftArray[i] === rightArray[j]) {
        array[k] = leftArray[i];
        steps.push(
          snapshotStep(
            "insert",
            array,
            [k],
            `Insertando ${leftArray[i]} en la posicion ${k}`,
          ),
        );
        i += 1;
      } else {
        array[k] = rightArray[j];
        steps.push(
          snapshotStep(
            "insert",
            array,
            [k],
            `Insertando ${rightArray[j]} en la posicion ${k}`,
          ),
        );
        j += 1;
      }
      k += 1;
    }

    while (i < leftArray.length) {
      array[k] = leftArray[i];
      steps.push(
        snapshotStep(
          "insert",
          array,
          [k],
          `Insertando ${leftArray[i]} en la posicion ${k}`,
        ),
      );
      i += 1;
      k += 1;
    }

    while (j < rightArray.length) {
      array[k] = rightArray[j];
      steps.push(
        snapshotStep(
          "insert",
          array,
          [k],
          `Insertando ${rightArray[j]} en la posicion ${k}`,
        ),
      );
      j += 1;
      k += 1;
    }
  };

  const sort = (left, right) => {
    if (left >= right) return;
    const middle = Math.floor((left + right) / 2);
    sort(left, middle);
    sort(middle + 1, right);
    merge(left, middle, right);
  };

  sort(0, array.length - 1);
  steps.push(snapshotStep("done", array, [], "Arreglo ordenado"));
  return steps;
}

function shellSortSteps(array, order) {
  const steps = [];

  for (let gap = Math.floor(array.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
    steps.push(snapshotStep("gap", array, [], `Separacion actual: ${gap}`));

    for (let i = gap; i < array.length; i += 1) {
      const temp = array[i];
      let j = i;

      while (j >= gap && shouldSwap(array[j - gap], temp, order)) {
        steps.push(
          snapshotStep(
            "compare",
            array,
            [j - gap, j],
            `Comparando ${array[j - gap]} y ${temp}`,
          ),
        );
        array[j] = array[j - gap];
        steps.push(
          snapshotStep(
            "move",
            array,
            [j - gap, j],
            `Moviendo ${array[j]} a la posicion ${j}`,
          ),
        );
        j -= gap;
      }

      array[j] = temp;
      steps.push(
        snapshotStep(
          "insert",
          array,
          [j],
          `Insertando ${temp} en la posicion ${j}`,
        ),
      );
    }
  }

  steps.push(snapshotStep("done", array, [], "Arreglo ordenado"));
  return steps;
}
