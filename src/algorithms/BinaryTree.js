export class Node {
  constructor(value, left = null, right = null) {
    this.value = value;
    this.left = left;
    this.right = right;
  }
}

const ensureFiniteNumber = (value, context = "valor") => {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    throw new Error(`El ${context} debe ser numerico.`);
  }

  return numericValue;
};

const normalizeSequence = (values, label) => {
  if (!Array.isArray(values)) {
    throw new Error(`${label} debe ser una lista de numeros.`);
  }

  if (values.length === 0) {
    throw new Error(`${label} no puede estar vacio.`);
  }

  const numericValues = values.map((value) =>
    ensureFiniteNumber(value, `valor de ${label}`),
  );

  if (new Set(numericValues).size !== numericValues.length) {
    throw new Error(
      `${label} no puede contener valores repetidos porque la reconstruccion seria ambigua.`,
    );
  }

  return numericValues;
};

const sameValues = (first, second) => {
  if (first.length !== second.length) return false;

  const expected = [...first].sort((a, b) => a - b);
  const received = [...second].sort((a, b) => a - b);

  return expected.every((value, index) => value === received[index]);
};

const sameSequence = (first, second) =>
  first.length === second.length &&
  first.every((value, index) => value === second[index]);

const serializeNode = (node) => {
  if (!node) return null;

  return {
    value: node.value,
    left: serializeNode(node.left),
    right: serializeNode(node.right),
  };
};

const cloneNode = (node) => {
  if (!node) return null;
  return new Node(node.value, cloneNode(node.left), cloneNode(node.right));
};

export class BinaryTree {
  constructor(root = null) {
    this.root = root;
  }

  clone() {
    return new BinaryTree(cloneNode(this.root));
  }

  isEmpty() {
    return this.root === null;
  }

  count(node = this.root) {
    if (!node) return 0;
    return 1 + this.count(node.left) + this.count(node.right);
  }

  insert(value) {
    const numericValue = ensureFiniteNumber(value);

    if (!this.root) {
      this.root = new Node(numericValue);
      return this.root;
    }

    let current = this.root;

    while (current) {
      if (numericValue === current.value) {
        throw new Error(
          `El valor ${numericValue} ya existe en el arbol. Los duplicados no estan permitidos.`,
        );
      }

      if (numericValue < current.value) {
        if (!current.left) {
          current.left = new Node(numericValue);
          return current.left;
        }

        current = current.left;
      } else {
        if (!current.right) {
          current.right = new Node(numericValue);
          return current.right;
        }

        current = current.right;
      }
    }

    return null;
  }

  inOrder(node = this.root, result = []) {
    if (!node) return result;
    this.inOrder(node.left, result);
    result.push(node.value);
    this.inOrder(node.right, result);
    return result;
  }

  preOrder(node = this.root, result = []) {
    if (!node) return result;
    result.push(node.value);
    this.preOrder(node.left, result);
    this.preOrder(node.right, result);
    return result;
  }

  postOrder(node = this.root, result = []) {
    if (!node) return result;
    this.postOrder(node.left, result);
    this.postOrder(node.right, result);
    result.push(node.value);
    return result;
  }

  height(node = this.root) {
    if (!node) return 0;
    return 1 + Math.max(this.height(node.left), this.height(node.right));
  }

  isBinarySearchTree() {
    const visit = (node, min, max) => {
      if (!node) return true;
      if (node.value <= min || node.value >= max) return false;
      return (
        visit(node.left, min, node.value) &&
        visit(node.right, node.value, max)
      );
    };

    return visit(this.root, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
  }

  toJSON() {
    return {
      root: serializeNode(this.root),
    };
  }

  fromJSON(json) {
    const rawData = typeof json === "string" ? JSON.parse(json) : json;
    const payload =
      rawData && typeof rawData === "object" && "tree" in rawData
        ? rawData.tree
        : rawData;

    const sourceRoot =
      payload && typeof payload === "object" && "root" in payload
        ? payload.root
        : payload ?? null;

    const seenValues = new Set();

    const deserializeNode = (node, path = "raiz") => {
      if (node == null) return null;

      if (typeof node !== "object" || Array.isArray(node)) {
        throw new Error(
          `La estructura importada es invalida en ${path}. Se esperaba un nodo del arbol.`,
        );
      }

      const numericValue = ensureFiniteNumber(node.value, `valor en ${path}`);

      if (seenValues.has(numericValue)) {
        throw new Error(
          `El valor ${numericValue} aparece mas de una vez en el JSON importado.`,
        );
      }

      seenValues.add(numericValue);

      return new Node(
        numericValue,
        deserializeNode(node.left, `${path}.left`),
        deserializeNode(node.right, `${path}.right`),
      );
    };

    this.root = deserializeNode(sourceRoot);
    return this;
  }

  static fromJSON(json) {
    return new BinaryTree().fromJSON(json);
  }

  buildFromInPre(inOrderValues, preOrderValues) {
    const inOrder = normalizeSequence(inOrderValues, "In-Order");
    const preOrder = normalizeSequence(preOrderValues, "Pre-Order");

    if (inOrder.length !== preOrder.length) {
      throw new Error(
        "In-Order y Pre-Order deben tener la misma cantidad de elementos.",
      );
    }

    if (!sameValues(inOrder, preOrder)) {
      throw new Error(
        "In-Order y Pre-Order deben contener exactamente los mismos valores.",
      );
    }

    const indexByValue = new Map(
      inOrder.map((value, index) => [value, index]),
    );
    let preIndex = 0;

    const build = (leftIndex, rightIndex) => {
      if (leftIndex > rightIndex) return null;

      const rootValue = preOrder[preIndex];

      if (rootValue == null) {
        throw new Error(
          "Los recorridos estan incompletos. No fue posible reconstruir el arbol.",
        );
      }

      preIndex += 1;

      const pivot = indexByValue.get(rootValue);

      if (pivot == null || pivot < leftIndex || pivot > rightIndex) {
        throw new Error(
          "In-Order y Pre-Order no son consistentes entre si.",
        );
      }

      return new Node(
        rootValue,
        build(leftIndex, pivot - 1),
        build(pivot + 1, rightIndex),
      );
    };

    const candidateRoot = build(0, inOrder.length - 1);

    if (preIndex !== preOrder.length) {
      throw new Error(
        "Los recorridos contienen informacion extra o estan desalineados.",
      );
    }

    const candidateTree = new BinaryTree(candidateRoot);

    if (
      !sameSequence(candidateTree.inOrder(), inOrder) ||
      !sameSequence(candidateTree.preOrder(), preOrder)
    ) {
      throw new Error(
        "La reconstruccion generada no coincide con los recorridos proporcionados.",
      );
    }

    this.root = candidateRoot;
    return this;
  }

  buildFromInPost(inOrderValues, postOrderValues) {
    const inOrder = normalizeSequence(inOrderValues, "In-Order");
    const postOrder = normalizeSequence(postOrderValues, "Post-Order");

    if (inOrder.length !== postOrder.length) {
      throw new Error(
        "In-Order y Post-Order deben tener la misma cantidad de elementos.",
      );
    }

    if (!sameValues(inOrder, postOrder)) {
      throw new Error(
        "In-Order y Post-Order deben contener exactamente los mismos valores.",
      );
    }

    const indexByValue = new Map(
      inOrder.map((value, index) => [value, index]),
    );
    let postIndex = postOrder.length - 1;

    const build = (leftIndex, rightIndex) => {
      if (leftIndex > rightIndex) return null;

      const rootValue = postOrder[postIndex];

      if (rootValue == null) {
        throw new Error(
          "Los recorridos estan incompletos. No fue posible reconstruir el arbol.",
        );
      }

      postIndex -= 1;

      const pivot = indexByValue.get(rootValue);

      if (pivot == null || pivot < leftIndex || pivot > rightIndex) {
        throw new Error(
          "In-Order y Post-Order no son consistentes entre si.",
        );
      }

      const rightNode = build(pivot + 1, rightIndex);
      const leftNode = build(leftIndex, pivot - 1);

      return new Node(rootValue, leftNode, rightNode);
    };

    const candidateRoot = build(0, inOrder.length - 1);

    if (postIndex !== -1) {
      throw new Error(
        "Los recorridos contienen informacion extra o estan desalineados.",
      );
    }

    const candidateTree = new BinaryTree(candidateRoot);

    if (
      !sameSequence(candidateTree.inOrder(), inOrder) ||
      !sameSequence(candidateTree.postOrder(), postOrder)
    ) {
      throw new Error(
        "La reconstruccion generada no coincide con los recorridos proporcionados.",
      );
    }

    this.root = candidateRoot;
    return this;
  }

  toGraph() {
    if (!this.root) {
      return {
        elements: [],
        width: 0,
        height: 0,
      };
    }

    const spanByNode = new Map();

    const measureSpan = (node) => {
      if (!node) return 0;

      const leftSpan = measureSpan(node.left);
      const rightSpan = measureSpan(node.right);
      const currentSpan = Math.max(1, leftSpan + rightSpan);

      spanByNode.set(node, currentSpan);
      return currentSpan;
    };

    const totalSpan = measureSpan(this.root);
    const horizontalGap = 140;
    const verticalGap = 110;
    const marginX = 80;
    const marginY = 80;
    const elements = [];

    const placeNode = (node, startSpan, depth, parent = null) => {
      if (!node) return;

      const nodeSpan = spanByNode.get(node) ?? 1;
      const leftSpan = node.left ? spanByNode.get(node.left) ?? 1 : 0;
      const x = marginX + (startSpan + nodeSpan / 2) * horizontalGap;
      const y = marginY + depth * verticalGap;
      const isLeaf = !node.left && !node.right;

      elements.push({
        data: {
          id: `node-${node.value}`,
          label: String(node.value),
          value: node.value,
          role: parent === null ? "root" : isLeaf ? "leaf" : "internal",
        },
        position: { x, y },
      });

      if (parent) {
        elements.push({
          data: {
            id: `edge-${parent.value}-${node.value}`,
            source: `node-${parent.value}`,
            target: `node-${node.value}`,
          },
        });
      }

      if (node.left) {
        placeNode(node.left, startSpan, depth + 1, node);
      }

      if (node.right) {
        placeNode(node.right, startSpan + leftSpan, depth + 1, node);
      }
    };

    placeNode(this.root, 0, 0);

    return {
      elements,
      width: marginX * 2 + totalSpan * horizontalGap,
      height: marginY * 2 + Math.max(0, this.height() - 1) * verticalGap,
    };
  }
}
