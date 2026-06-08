import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  FaDice,
  FaDownload,
  FaFolderOpen,
  FaQuestion,
  FaTimes,
  FaTrash,
  FaTree,
} from "react-icons/fa";
import { TbArrowBackUp } from "react-icons/tb";
import { Notification } from "../components/Notification";
import { ExportModal } from "../components/ExportModal";
import { BinaryTree } from "../algorithms/BinaryTree";
import { TreeVisualizer } from "../components/BinaryTree/TreeVisualizer";
import { RandomTreeModal } from "../components/BinaryTree/RandomTreeModal";
import { TraversalPanel } from "../components/BinaryTree/TraversalPanel";

const TRAVERSAL_DELAY = 560;

const EMPTY_TRAVERSAL_STATE = {
  running: false,
  key: "",
  label: "",
  sequence: [],
  visitedValues: [],
  activeValue: null,
  step: 0,
};

const traversalLabels = {
  inOrder: "In-Order",
  preOrder: "Pre-Order",
  postOrder: "Post-Order",
};

const exampleByMethod = {
  pre: "4, 5, 2, 3, 1",
  post: "4, 5, 2, 3, 1",
};

const wait = (ms) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });

const parseNumberList = (value, label) => {
  const parts = value
    .split(/[\s,]+/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (!parts.length) {
    throw new Error(`${label} no puede estar vacio.`);
  }

  const numbers = parts.map((item) => Number(item));

  if (numbers.some((item) => !Number.isFinite(item))) {
    throw new Error(`${label} solo admite valores numericos.`);
  }

  return numbers;
};

const createUniqueRandomValues = (count, min, max) => {
  const values = [];

  for (let current = Math.ceil(min); current <= Math.floor(max); current += 1) {
    values.push(current);
  }

  for (let index = values.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [values[index], values[randomIndex]] = [values[randomIndex], values[index]];
  }

  return values.slice(0, count);
};

export function BinaryTreePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const traversalTokenRef = useRef(0);

  const [tree, setTree] = useState(() => new BinaryTree());
  const [mode, setMode] = useState("build");
  const [reconstructMethod, setReconstructMethod] = useState("pre");
  const [insertInput, setInsertInput] = useState("");
  const [inOrderInput, setInOrderInput] = useState("4, 2, 5, 1, 3");
  const [secondaryInput, setSecondaryInput] = useState(exampleByMethod.pre);
  const [buildError, setBuildError] = useState("");
  const [reconstructError, setReconstructError] = useState("");
  const [notification, setNotification] = useState(null);
  const [generatedValues, setGeneratedValues] = useState([]);
  const [showRandomModal, setShowRandomModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [suggestedName, setSuggestedName] = useState("");
  const [visualState, setVisualState] = useState({
    preset: "rebuild",
    focusValue: null,
    nonce: 0,
  });
  const [traversalState, setTraversalState] = useState(() => ({
    ...EMPTY_TRAVERSAL_STATE,
  }));

  const traversals = {
    inOrder: tree.inOrder(),
    preOrder: tree.preOrder(),
    postOrder: tree.postOrder(),
  };
  const nodeCount = traversals.preOrder.length;
  const treeHeight = tree.height();
  const graphData = tree.toGraph();
  const treeSignature = JSON.stringify(tree.toJSON());
  const isBinarySearchTree = tree.isBinarySearchTree();
  const hasTree = nodeCount > 0;
  const buildBlocked = hasTree && !isBinarySearchTree;
  const secondaryLabel =
    reconstructMethod === "pre" ? "Pre-Order" : "Post-Order";

  const showMessage = (message, type = "info") => {
    setNotification({ message, type });
  };

  const resetTraversal = () => {
    traversalTokenRef.current += 1;
    setTraversalState({ ...EMPTY_TRAVERSAL_STATE });
  };

  const applyVisualRefresh = (preset, focusValue = null) => {
    setVisualState({
      preset,
      focusValue,
      nonce: Date.now() + Math.random(),
    });
  };

  const applyTree = (
    nextTree,
    {
      preset = "rebuild",
      focusValue = null,
      nextMode = mode,
      nextGeneratedValues = [],
      successMessage = "",
    } = {},
  ) => {
    resetTraversal();
    setTree(nextTree);
    setMode(nextMode);
    setGeneratedValues(nextGeneratedValues);
    setBuildError("");
    setReconstructError("");
    applyVisualRefresh(preset, focusValue);

    if (successMessage) {
      showMessage(successMessage, "success");
    }
  };

  const handleModeChange = (nextMode) => {
    setMode(nextMode);

    if (nextMode === "build" && buildBlocked) {
      showMessage(
        "El arbol actual no cumple la propiedad BST. Puedes recorrerlo o exportarlo, pero para insertar debes reiniciarlo o generar uno nuevo.",
        "warning",
      );
    }
  };

  const handleInsertSubmit = (event) => {
    event.preventDefault();

    if (buildBlocked) {
      const message =
        "La insercion BST solo esta disponible cuando el arbol actual cumple la propiedad de busqueda.";
      setBuildError(message);
      showMessage(message, "warning");
      return;
    }

    try {
      const values = parseNumberList(insertInput, "La entrada de insercion");
      const nextTree = tree.clone();

      values.forEach((value) => {
        nextTree.insert(value);
      });

      applyTree(nextTree, {
        preset: values.length > 1 ? "rebuild" : "insert",
        focusValue: values[values.length - 1],
        nextMode: "build",
        nextGeneratedValues: [],
        successMessage:
          values.length === 1
            ? `Nodo ${values[0]} insertado correctamente.`
            : `${values.length} nodos insertados correctamente.`,
      });
      setInsertInput("");
    } catch (error) {
      setBuildError(error.message);
      showMessage(error.message, "error");
    }
  };

  const handleReconstructSubmit = (event) => {
    event.preventDefault();

    try {
      const inOrderValues = parseNumberList(inOrderInput, "In-Order");
      const secondaryValues = parseNumberList(secondaryInput, secondaryLabel);
      const nextTree = new BinaryTree();

      if (reconstructMethod === "pre") {
        nextTree.buildFromInPre(inOrderValues, secondaryValues);
      } else {
        nextTree.buildFromInPost(inOrderValues, secondaryValues);
      }

      applyTree(nextTree, {
        preset: "rebuild",
        nextMode: "reconstruct",
        nextGeneratedValues: [],
        successMessage: "Arbol reconstruido correctamente.",
      });
    } catch (error) {
      setReconstructError(error.message);
      showMessage(error.message, "error");
    }
  };

  const handleResetTree = () => {
    resetTraversal();
    setTree(new BinaryTree());
    setGeneratedValues([]);
    setBuildError("");
    setReconstructError("");
    setInsertInput("");
    applyVisualRefresh("rebuild");
    showMessage("Arbol reiniciado.", "info");
  };

  const handleOpenExport = () => {
    if (!hasTree) {
      showMessage("No hay arbol para exportar.", "warning");
      return;
    }

    setSuggestedName(
      `binary_tree_${new Date().toLocaleDateString().replace(/\//g, "-")}`,
    );
    setShowExportModal(true);
  };

  const handleConfirmExport = (filename) => {
    if (!hasTree) {
      showMessage("No hay arbol para exportar.", "warning");
      return;
    }

    try {
      const exportName = filename.trim() || suggestedName || "binary_tree";
      const payload = {
        version: 1,
        type: "binary-tree",
        mode,
        generatedValues,
        exportedAt: new Date().toISOString(),
        tree: tree.toJSON(),
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `${exportName}.json`;
      link.click();
      URL.revokeObjectURL(url);
      setShowExportModal(false);
      showMessage("Arbol exportado correctamente.", "success");
    } catch (error) {
      showMessage(`No se pudo exportar el arbol: ${error.message}`, "error");
    }
  };

  const handleImportTree = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const text = await file.text();
      const payload = JSON.parse(text);
      const nextTree = BinaryTree.fromJSON(payload);
      const importedMode =
        payload.mode === "build" && nextTree.isBinarySearchTree()
          ? "build"
          : "reconstruct";
      const importedGeneratedValues = Array.isArray(payload.generatedValues)
        ? payload.generatedValues
            .map((value) => Number(value))
            .filter((value) => Number.isFinite(value))
        : [];

      applyTree(nextTree, {
        preset: "rebuild",
        nextMode: importedMode,
        nextGeneratedValues: importedGeneratedValues,
        successMessage: "Arbol importado correctamente.",
      });
    } catch (error) {
      showMessage(`No se pudo importar el arbol: ${error.message}`, "error");
    } finally {
      event.target.value = "";
    }
  };

  const handleGenerateRandomTree = ({ count, min, max }) => {
    try {
      const values = createUniqueRandomValues(count, min, max);
      const nextTree = new BinaryTree();

      values.forEach((value) => {
        nextTree.insert(value);
      });

      applyTree(nextTree, {
        preset: "rebuild",
        nextMode: "build",
        nextGeneratedValues: values,
        successMessage: "Arbol aleatorio generado correctamente.",
      });
      setShowRandomModal(false);
    } catch (error) {
      showMessage(`No se pudo generar el arbol: ${error.message}`, "error");
    }
  };

  const handlePlayTraversal = async (key) => {
    const sequence = traversals[key] ?? [];

    if (!sequence.length) {
      showMessage("Primero construye, reconstruye o importa un arbol.", "warning");
      return;
    }

    const label = traversalLabels[key];
    const nextToken = traversalTokenRef.current + 1;

    traversalTokenRef.current = nextToken;
    setTraversalState({
      running: true,
      key,
      label,
      sequence,
      visitedValues: [],
      activeValue: null,
      step: 0,
    });

    for (let index = 0; index < sequence.length; index += 1) {
      if (traversalTokenRef.current !== nextToken) return;

      setTraversalState({
        running: true,
        key,
        label,
        sequence,
        visitedValues: sequence.slice(0, index + 1),
        activeValue: sequence[index],
        step: index + 1,
      });

      await wait(TRAVERSAL_DELAY);
    }

    if (traversalTokenRef.current !== nextToken) return;

    setTraversalState({
      running: false,
      key,
      label,
      sequence,
      visitedValues: [...sequence],
      activeValue: null,
      step: sequence.length,
    });
  };

  useEffect(() => {
    return () => {
      traversalTokenRef.current += 1;
    };
  }, []);

  return (
    <PageWrapper>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {showExportModal && (
        <ExportModal
          defaultName={suggestedName}
          title="Exportar arbol"
          label="Nombre del archivo"
          helpText="El arbol se exportara en formato JSON."
          onConfirm={handleConfirmExport}
          onCancel={() => setShowExportModal(false)}
        />
      )}

      {showRandomModal && (
        <RandomTreeModal
          onClose={() => setShowRandomModal(false)}
          onGenerate={handleGenerateRandomTree}
        />
      )}

      {showHelp && (
        <HelpOverlay onClick={() => setShowHelp(false)}>
          <HelpModal onClick={(event) => event.stopPropagation()}>
            <HelpHeader>
              <h2>
                <FaQuestion /> Como usar Arboles Binarios
              </h2>
              <CloseButton type="button" onClick={() => setShowHelp(false)} title="Cerrar">
                <FaTimes />
              </CloseButton>
            </HelpHeader>

            <HelpBody>
              <HelpStep>
                <strong>1. Elige un modo de trabajo</strong>
                <p>
                  En el panel derecho cambia entre <em>Construir Arbol</em> (insertar
                  valores en un BST) y <em>Reconstruir Arbol</em> (generar el arbol a
                  partir de sus recorridos).
                </p>
              </HelpStep>

              <HelpStep>
                <strong>2. Construir un BST</strong>
                <p>
                  Escribe un valor o varios separados por comas o espacios (ej.{" "}
                  <code>10, 5, 15, 3, 7</code>) y pulsa <em>Insertar nodos</em> o Enter.
                  Los valores repetidos se bloquean. Tambien puedes pulsar{" "}
                  <em>Aleatorio</em> para generar un arbol al instante.
                </p>
              </HelpStep>

              <HelpStep>
                <strong>3. Reconstruir un arbol</strong>
                <p>
                  Elige el metodo (<em>In-Order + Pre-Order</em> o{" "}
                  <em>In-Order + Post-Order</em>), escribe ambos recorridos y pulsa{" "}
                  <em>Reconstruir arbol</em>. Ejemplo: In-Order <code>4, 2, 5, 1, 3</code>{" "}
                  y Pre-Order <code>4, 5, 2, 3, 1</code>.
                </p>
              </HelpStep>

              <HelpStep>
                <strong>4. Anima los recorridos</strong>
                <p>
                  En el panel de recorridos pulsa <em>In-Order</em>, <em>Pre-Order</em> o{" "}
                  <em>Post-Order</em> para ver, paso a paso, el orden en que se visitan los
                  nodos. El nodo activo se resalta en naranja sobre el arbol.
                </p>
              </HelpStep>

              <HelpStep>
                <strong>5. Navega el canvas</strong>
                <p>
                  Usa la rueda del mouse para acercar o alejar y arrastra el fondo para
                  mover la vista. La leyenda de colores indica raiz, nodos internos, hojas y
                  el recorrido activo. El boton <em>Reset</em> limpia el arbol.
                </p>
              </HelpStep>

              <HelpStep>
                <strong>6. Importar / exportar</strong>
                <p>
                  En el ultimo panel puedes <em>Importar JSON</em> un arbol guardado o{" "}
                  <em>Exportar JSON</em> el arbol actual para reutilizarlo despues.
                </p>
              </HelpStep>
            </HelpBody>
          </HelpModal>
        </HelpOverlay>
      )}

      <Header>
        <HeaderActions>
          <BackButton type="button" onClick={() => navigate("/graph")}>
            <TbArrowBackUp /> Volver al Grafo
          </BackButton>
          <HelpButton type="button" onClick={() => setShowHelp(true)} title="Ayuda">
            <FaQuestion />
          </HelpButton>
        </HeaderActions>

        <TitleBlock>
          <span>Estructuras de datos visuales</span>
          <h1>Arboles Binarios</h1>
          <p>
            Construye un BST, reconstruye arboles desde recorridos y anima sus
            recorridos directamente en el navegador.
          </p>
        </TitleBlock>
      </Header>

      <HiddenFileInput
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleImportTree}
      />

      <Workspace>
        <VisualColumn>
          <VisualCard>
            <VisualHeader>
              <div>
                <SectionEyebrow>Panel de visualizacion</SectionEyebrow>
                <PanelTitle>Arbol renderizado</PanelTitle>
              </div>
              <StatusPills>
                <TreeStatePill $kind={isBinarySearchTree ? "build" : "reconstruct"}>
                  {hasTree
                    ? isBinarySearchTree
                      ? "BST"
                      : "Arbol general"
                    : "Sin nodos"}
                </TreeStatePill>
                <TreeStatePill $kind="info">
                  {mode === "build" ? "Modo Construir" : "Modo Reconstruir"}
                </TreeStatePill>
              </StatusPills>
            </VisualHeader>

            <LegendRow>
              <LegendItem>
                <LegendDot $color="#f59e0b" /> Raiz
              </LegendItem>
              <LegendItem>
                <LegendDot $color="#2563eb" /> Nodo interno
              </LegendItem>
              <LegendItem>
                <LegendDot $color="#059669" /> Hoja
              </LegendItem>
              <LegendItem>
                <LegendDot $color="#f97316" /> Recorrido activo
              </LegendItem>
            </LegendRow>

            <CanvasStage>
              <CanvasShell>
                {hasTree ? (
                  <>
                    <TreeVisualizer
                      elements={graphData.elements}
                      treeSignature={treeSignature}
                      animationPreset={visualState.preset}
                      animationNonce={visualState.nonce}
                      focusValue={visualState.focusValue}
                      visitedValues={traversalState.visitedValues}
                      activeValue={traversalState.activeValue}
                    />
                    <ResetButton type="button" onClick={handleResetTree}>
                      <FaTrash />
                      Reset
                    </ResetButton>
                  </>
                ) : (
                  <EmptyState>
                    <EmptyIcon>
                      <FaTree />
                    </EmptyIcon>
                    <h2>Empieza tu arbol</h2>
                    <p>
                      Inserta valores, genera un conjunto aleatorio o reconstruye
                      un arbol a partir de sus recorridos.
                    </p>
                  </EmptyState>
                )}
              </CanvasShell>
            </CanvasStage>

            <CanvasFooter>
              <span>
                Usa la rueda del mouse para acercar o alejar y arrastra el
                fondo para mover la vista.
              </span>
              {traversalState.sequence.length > 0 && (
                <TraversalBadge $running={traversalState.running}>
                  {traversalState.running
                    ? `${traversalState.label} en curso`
                    : `Ultimo recorrido: ${traversalState.label}`}
                </TraversalBadge>
              )}
            </CanvasFooter>
          </VisualCard>
        </VisualColumn>

        <ControlColumn>
          <ControlCard>
            <SectionEyebrow>Modo de trabajo</SectionEyebrow>
            <PanelTitle>Selecciona como crear el arbol</PanelTitle>

            <ModeTabs>
              <ModeButton
                type="button"
                $active={mode === "build"}
                onClick={() => handleModeChange("build")}
              >
                Construir Arbol
              </ModeButton>
              <ModeButton
                type="button"
                $active={mode === "reconstruct"}
                onClick={() => handleModeChange("reconstruct")}
              >
                Reconstruir Arbol
              </ModeButton>
            </ModeTabs>

            {mode === "build" ? (
              <>
                <Form onSubmit={handleInsertSubmit}>
                  <Field>
                    <label>Insercion manual</label>
                    <input
                      type="text"
                      value={insertInput}
                      onChange={(event) => {
                        setInsertInput(event.target.value);
                        setBuildError("");
                      }}
                      placeholder="10 o 10, 5, 15, 3, 7"
                      disabled={buildBlocked}
                    />
                    <HelperText>
                      Presiona Enter o usa el boton para insertar. Los valores
                      repetidos se bloquean para evitar conflictos.
                    </HelperText>
                  </Field>

                  {buildError && <InlineError>{buildError}</InlineError>}

                  {buildBlocked && (
                    <InlineWarning>
                      El arbol actual no es un BST valido. Reinicialo, genera
                      uno nuevo o importa/exporta antes de volver a insertar.
                    </InlineWarning>
                  )}

                  <ActionRow>
                    <PrimaryButton type="submit" disabled={buildBlocked}>
                      Insertar nodos
                    </PrimaryButton>
                    <SecondaryButton
                      type="button"
                      onClick={() => setShowRandomModal(true)}
                    >
                      <FaDice /> Aleatorio
                    </SecondaryButton>
                  </ActionRow>
                </Form>
              </>
            ) : (
              <Form onSubmit={handleReconstructSubmit}>
                <Field>
                  <label>Metodo de reconstruccion</label>
                  <ToggleRow>
                    <ToggleButton
                      type="button"
                      $active={reconstructMethod === "pre"}
                      onClick={() => {
                        setReconstructMethod("pre");
                        setReconstructError("");
                      }}
                    >
                      In-Order + Pre-Order
                    </ToggleButton>
                    <ToggleButton
                      type="button"
                      $active={reconstructMethod === "post"}
                      onClick={() => {
                        setReconstructMethod("post");
                        setReconstructError("");
                      }}
                    >
                      In-Order + Post-Order
                    </ToggleButton>
                  </ToggleRow>
                </Field>

                <Field>
                  <label>In-Order</label>
                  <textarea
                    rows="3"
                    value={inOrderInput}
                    onChange={(event) => {
                      setInOrderInput(event.target.value);
                      setReconstructError("");
                    }}
                    placeholder="4, 2, 5, 1, 3"
                  />
                </Field>

                <Field>
                  <label>{secondaryLabel}</label>
                  <textarea
                    rows="3"
                    value={secondaryInput}
                    onChange={(event) => {
                      setSecondaryInput(event.target.value);
                      setReconstructError("");
                    }}
                    placeholder={exampleByMethod[reconstructMethod]}
                  />
                  <HelperText>
                    Ejemplo rapido: In-Order `4, 2, 5, 1, 3` y {secondaryLabel}{" "}
                    `{exampleByMethod[reconstructMethod]}`.
                  </HelperText>
                </Field>

                {reconstructError && (
                  <InlineError>{reconstructError}</InlineError>
                )}

                <PrimaryButton type="submit">Reconstruir arbol</PrimaryButton>
              </Form>
            )}
          </ControlCard>

          <ControlCard>
            <SectionEyebrow>Estadisticas</SectionEyebrow>
            <PanelTitle>Resumen del arbol</PanelTitle>

            <StatsGrid>
              <StatCard>
                <StatLabel>Nodos</StatLabel>
                <StatValue>{nodeCount}</StatValue>
              </StatCard>
              <StatCard>
                <StatLabel>Altura</StatLabel>
                <StatValue>{treeHeight}</StatValue>
              </StatCard>
              <StatCard>
                <StatLabel>Tipo</StatLabel>
                <StatValueSmall>
                  {hasTree
                    ? isBinarySearchTree
                      ? "BST"
                      : "General"
                    : "-"}
                </StatValueSmall>
              </StatCard>
            </StatsGrid>

            {generatedValues.length > 0 && (
              <RandomSummary>
                <SummaryHeader>
                  <span>Valores generados</span>
                  <small>{generatedValues.length} nodos</small>
                </SummaryHeader>
                <ChipWrap>
                  {generatedValues.map((value) => (
                    <ValueChip key={value}>{value}</ValueChip>
                  ))}
                </ChipWrap>
              </RandomSummary>
            )}
          </ControlCard>

          <TraversalPanel
            traversals={traversals}
            traversalState={traversalState}
            onPlayTraversal={handlePlayTraversal}
            disabled={!hasTree}
          />

          <ControlCard>
            <SectionEyebrow>Importar y exportar</SectionEyebrow>
            <PanelTitle>Persistencia del arbol</PanelTitle>

            <ActionColumn>
              <SecondaryButton
                type="button"
                onClick={() => fileInputRef.current?.click()}
              >
                <FaFolderOpen /> Importar JSON
              </SecondaryButton>
              <SecondaryButton type="button" onClick={handleOpenExport}>
                <FaDownload /> Exportar JSON
              </SecondaryButton>
              <SecondaryButton
                type="button"
                onClick={() => setShowRandomModal(true)}
              >
                <FaDice /> Generar desde modal
              </SecondaryButton>
            </ActionColumn>
          </ControlCard>
        </ControlColumn>
      </Workspace>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  overflow-x: hidden;
  overflow-y: auto;
  background:
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.15), transparent 26%),
    radial-gradient(circle at 90% 12%, rgba(249, 115, 22, 0.14), transparent 24%),
    linear-gradient(180deg, #040914 0%, #0c1324 100%);
  color: var(--text-primary);

  @media (max-width: 640px) {
    padding: 8px;
  }
`;

const Header = styled.header`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  align-items: start;
  padding: 12px 14px;
  border-radius: 16px;
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  box-shadow: var(--shadow-md);
  flex-shrink: 0;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const BackButton = styled.button`
  min-height: 44px;
  padding: 0 16px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.1);
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const HelpButton = styled.button`
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 12px;
  border: 1px solid rgba(125, 211, 252, 0.4);
  background: rgba(125, 211, 252, 0.14);
  color: #7dd3fc;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.05rem;
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    color: #fff;
    background: linear-gradient(135deg, #0ea5e9, #2563eb);
    transform: translateY(-1px);
  }
`;

const HelpOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  background: rgba(2, 6, 16, 0.72);
  backdrop-filter: blur(4px);
`;

const HelpModal = styled.div`
  width: min(640px, 100%);
  max-height: 85vh;
  overflow: auto;
  border-radius: 18px;
  border: 1px solid var(--glass-border);
  background: linear-gradient(180deg, #081020 0%, #0c1426 100%);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
`;

const HelpHeader = styled.div`
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 18px;
  border-bottom: 1px solid var(--glass-border);
  background: rgba(8, 16, 32, 0.94);

  h2 {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    font-size: 1.12rem;
    color: var(--text-primary);

    svg {
      color: #7dd3fc;
    }
  }
`;

const CloseButton = styled.button`
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-secondary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    color: #fff;
    background: rgba(239, 68, 68, 0.22);
    border-color: rgba(239, 68, 68, 0.32);
  }
`;

const HelpBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
`;

const HelpStep = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  strong {
    color: var(--text-primary);
    font-size: 0.98rem;
  }

  p {
    margin: 0;
    color: var(--text-secondary);
    font-size: 0.9rem;
    line-height: 1.55;
  }

  code {
    padding: 1px 6px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.08);
    color: #bae6fd;
    font-size: 0.85rem;
  }

  em {
    color: var(--text-primary);
    font-style: normal;
    font-weight: 700;
  }
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  span {
    color: #7dd3fc;
    font-size: 0.8rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  h1 {
    margin: 0;
    font-size: clamp(1.65rem, 3vw, 2.45rem);
    line-height: 1.05;
  }

  p {
    margin: 0;
    color: var(--text-secondary);
    max-width: 72ch;
    line-height: 1.5;
    font-size: 0.94rem;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const Workspace = styled.div`
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(360px, 0.95fr);
  gap: 10px;
  overflow: visible;

  @media (max-width: 1180px) {
    grid-template-columns: 1fr;
  }
`;

const VisualColumn = styled.section`
  min-width: 0;
  min-height: 0;
  display: flex;
  align-items: stretch;
`;

const VisualCard = styled.div`
  flex: 1;
  width: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  border-radius: 18px;
  border: 1px solid var(--glass-border);
  background: rgba(8, 14, 26, 0.85);
  box-shadow: var(--shadow-md);
`;

const VisualHeader = styled.div`
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`;

const SectionEyebrow = styled.span`
  color: #7dd3fc;
  font-size: 0.76rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const PanelTitle = styled.h2`
  margin: 6px 0 0;
  font-size: 1.02rem;
  color: var(--text-primary);
`;

const StatusPills = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const TreeStatePill = styled.span`
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  font-size: 0.82rem;
  font-weight: 800;
  border: 1px solid
    ${(props) =>
      props.$kind === "build"
        ? "rgba(34, 197, 94, 0.35)"
        : props.$kind === "reconstruct"
          ? "rgba(249, 115, 22, 0.35)"
          : "rgba(125, 211, 252, 0.24)"};
  background: ${(props) =>
    props.$kind === "build"
      ? "rgba(34, 197, 94, 0.12)"
      : props.$kind === "reconstruct"
        ? "rgba(249, 115, 22, 0.12)"
        : "rgba(125, 211, 252, 0.12)"};
  color: ${(props) =>
    props.$kind === "build"
      ? "#bbf7d0"
      : props.$kind === "reconstruct"
        ? "#fdba74"
        : "#bae6fd"};
`;

const LegendRow = styled.div`
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  color: var(--text-secondary);
  font-size: 0.88rem;
`;

const LegendItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const LegendDot = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${(props) => props.$color};
  box-shadow: 0 0 16px ${(props) => props.$color}55;
`;

const CanvasShell = styled.div`
  width: 100%;
  min-width: 0;
  height: clamp(420px, 56vh, 560px);
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background:
    linear-gradient(to right, rgba(148, 163, 184, 0.08) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(148, 163, 184, 0.08) 1px, transparent 1px),
    radial-gradient(circle at top, rgba(56, 189, 248, 0.12), transparent 34%),
    #f8fafc;
  background-size: 42px 42px, 42px 42px, auto, auto;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.22);

  @media (max-width: 1180px) {
    height: clamp(380px, 50vh, 500px);
  }

  @media (max-width: 640px) {
    width: 100%;
    min-width: 0;
    height: 360px;
  }
`;

const CanvasStage = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: flex-start;
  justify-content: stretch;
  padding: 2px 0 8px;
`;

const EmptyState = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 24px;
  color: #0f172a;

  h2 {
    margin: 14px 0 8px;
    font-size: 1.45rem;
  }

  p {
    margin: 0;
    max-width: 30rem;
    line-height: 1.6;
    color: #334155;
  }
`;

const EmptyIcon = styled.div`
  width: 88px;
  height: 88px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(37, 99, 235, 0.12);
  color: #2563eb;
  font-size: 2.4rem;
  box-shadow: 0 16px 34px rgba(37, 99, 235, 0.18);
`;

const ResetButton = styled.button`
  position: absolute;
  right: 18px;
  bottom: 18px;
  min-height: 48px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid rgba(239, 68, 68, 0.32);
  background: rgba(239, 68, 68, 0.92);
  color: #fff;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 18px 30px rgba(239, 68, 68, 0.24);
  transition: all var(--transition-fast);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 22px 36px rgba(239, 68, 68, 0.32);
  }
`;

const CanvasFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  color: var(--text-secondary);
  font-size: 0.88rem;
`;

const TraversalBadge = styled.span`
  min-height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  border: 1px solid
    ${(props) =>
      props.$running ? "rgba(249, 115, 22, 0.35)" : "rgba(139, 92, 246, 0.32)"};
  background: ${(props) =>
    props.$running ? "rgba(249, 115, 22, 0.12)" : "rgba(139, 92, 246, 0.12)"};
  color: ${(props) => (props.$running ? "#fdba74" : "#ddd6fe")};
  font-size: 0.8rem;
  font-weight: 800;
`;

const ControlColumn = styled.section`
  min-height: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  padding-right: 4px;
  max-height: 100%;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 999px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(125, 211, 252, 0.24);
    border-radius: 999px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(125, 211, 252, 0.38);
  }
`;

const ControlCard = styled.section`
  border-radius: 16px;
  border: 1px solid var(--glass-border);
  background: rgba(8, 14, 26, 0.76);
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ModeTabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const ModeButton = styled.button`
  min-height: 44px;
  border-radius: 12px;
  border: 1px solid
    ${(props) =>
      props.$active ? "rgba(56, 189, 248, 0.45)" : "rgba(255, 255, 255, 0.08)"};
  background: ${(props) =>
    props.$active ? "rgba(56, 189, 248, 0.16)" : "rgba(255, 255, 255, 0.04)"};
  color: ${(props) => (props.$active ? "#bae6fd" : "var(--text-primary)")};
  font-weight: 800;
  cursor: pointer;
  transition: all var(--transition-fast);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    color: var(--text-secondary);
    font-size: 0.76rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  input,
  textarea {
    width: 100%;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);
    color: var(--text-primary);
    padding: 12px 14px;
    outline: none;
    font-weight: 600;
    transition: border-color var(--transition-fast);
  }

  input {
    min-height: 46px;
  }

  textarea {
    resize: vertical;
    min-height: 94px;
    line-height: 1.5;
  }

  input:focus,
  textarea:focus {
    border-color: rgba(56, 189, 248, 0.45);
  }

  input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const HelperText = styled.p`
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.84rem;
  line-height: 1.5;
`;

const InlineError = styled.div`
  border-radius: 12px;
  border: 1px solid rgba(239, 68, 68, 0.35);
  background: rgba(239, 68, 68, 0.12);
  color: #fecaca;
  padding: 12px 14px;
  font-weight: 700;
  line-height: 1.45;
`;

const InlineWarning = styled.div`
  border-radius: 12px;
  border: 1px solid rgba(249, 115, 22, 0.32);
  background: rgba(249, 115, 22, 0.12);
  color: #fdba74;
  padding: 12px 14px;
  font-weight: 700;
  line-height: 1.45;
`;

const ActionRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const ActionColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const buttonBase = `
  min-height: 44px;
  padding: 0 16px;
  border-radius: 12px;
  border: 1px solid transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  font-weight: 800;
  cursor: pointer;
  transition: all var(--transition-fast);

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    transform: translateY(-1px);
  }
`;

const PrimaryButton = styled.button`
  ${buttonBase}
  background: linear-gradient(135deg, #0ea5e9, #2563eb);
  color: #fff;
  box-shadow: 0 14px 28px rgba(37, 99, 235, 0.22);
`;

const SecondaryButton = styled.button`
  ${buttonBase}
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.08);
  color: var(--text-primary);
`;

const ToggleRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const ToggleButton = styled.button`
  min-height: 42px;
  padding: 0 12px;
  border-radius: 12px;
  border: 1px solid
    ${(props) =>
      props.$active ? "rgba(249, 115, 22, 0.35)" : "rgba(255, 255, 255, 0.08)"};
  background: ${(props) =>
    props.$active ? "rgba(249, 115, 22, 0.14)" : "rgba(255, 255, 255, 0.04)"};
  color: ${(props) => (props.$active ? "#fdba74" : "var(--text-primary)")};
  font-weight: 800;
  cursor: pointer;
  transition: all var(--transition-fast);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.article`
  border-radius: 16px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.04);
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StatLabel = styled.span`
  color: var(--text-secondary);
  font-size: 0.76rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const StatValue = styled.strong`
  font-size: 2rem;
  line-height: 1;
  color: var(--text-primary);
`;

const StatValueSmall = styled.strong`
  font-size: 1.1rem;
  line-height: 1.2;
  color: var(--text-primary);
`;

const RandomSummary = styled.div`
  border-radius: 16px;
  padding: 14px;
  border: 1px solid rgba(56, 189, 248, 0.18);
  background: rgba(56, 189, 248, 0.08);
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SummaryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;

  span {
    font-weight: 800;
    color: var(--text-primary);
  }

  small {
    color: var(--text-secondary);
    font-size: 0.8rem;
  }
`;

const ChipWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const ValueChip = styled.span`
  min-height: 32px;
  padding: 0 11px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  background: rgba(14, 165, 233, 0.16);
  border: 1px solid rgba(14, 165, 233, 0.26);
  color: #bae6fd;
  font-weight: 800;
  font-size: 0.84rem;
`;
