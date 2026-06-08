import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import {
  FaDownload,
  FaPause,
  FaPlay,
  FaQuestion,
  FaRandom,
  FaRedo,
  FaTimes,
  FaTrash,
  FaUpload,
} from "react-icons/fa";
import { SortBoard } from "../components/Sorts/SortBoard";
import { SortStatsPanel } from "../components/Sorts/SortStatsPanel";
import { SORT_ALGORITHMS, buildSortingSteps } from "../utils/sortingAlgorithms";

const MIN_SIZE = 5;
const MAX_SIZE = 50;
const MIN_VALUE = 1;
const MAX_VALUE = 100;
const STEP_DELAY = 420;

const orderLabels = {
  asc: "Ascendente",
  desc: "Descendente",
};

const validateArray = (values) => {
  if (!values.length) return "El arreglo esta vacio.";
  if (values.length < MIN_SIZE || values.length > MAX_SIZE) {
    return `El tamano del arreglo debe estar entre ${MIN_SIZE} y ${MAX_SIZE}.`;
  }
  if (values.some((value) => !Number.isFinite(value))) {
    return "Todos los elementos deben ser numericos.";
  }
  if (values.some((value) => value < MIN_VALUE || value > MAX_VALUE)) {
    return `Los valores deben estar entre ${MIN_VALUE} y ${MAX_VALUE}.`;
  }
  return "";
};

const createRandomArray = (size) =>
  Array.from({ length: size }, () =>
    Math.floor(Math.random() * (MAX_VALUE - MIN_VALUE + 1)) + MIN_VALUE,
  );

export function SortsPage() {
  const [array, setArray] = useState([]);
  const [originalArray, setOriginalArray] = useState([]);
  const [customInput, setCustomInput] = useState("10, 5, 30, 2, 15");
  const [size, setSize] = useState(12);
  const [algorithm, setAlgorithm] = useState("selection");
  const [order, setOrder] = useState("asc");
  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(-1);
  const [stepLog, setStepLog] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [message, setMessage] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const fileInputRef = useRef(null);
  const startedAtRef = useRef(null);
  const elapsedBeforeRunRef = useRef(0);

  const currentStep = stepIndex >= 0 ? steps[stepIndex] : null;
  const isFinished = currentStep?.type === "done";
  const controlsLocked = isRunning;

  const visibleArray = currentStep?.array ?? array;
  const activeIndices = currentStep?.indices ?? [];

  const showMessage = (text, type = "info") => {
    setMessage({ text, type });
  };

  const loadArray = (values, successMessage) => {
    const validationError = validateArray(values);
    if (validationError) {
      showMessage(validationError, "error");
      return false;
    }

    setArray(values);
    setOriginalArray(values);
    setSteps([]);
    setStepIndex(-1);
    setStepLog([]);
    setIsRunning(false);
    setHasStarted(false);
    setElapsedMs(0);
    elapsedBeforeRunRef.current = 0;
    startedAtRef.current = null;
    showMessage(successMessage, "success");
    return true;
  };

  const handleGenerateRandom = () => {
    const numericSize = Number(size);
    if (!Number.isInteger(numericSize) || numericSize < MIN_SIZE || numericSize > MAX_SIZE) {
      showMessage(`El tamano del arreglo debe estar entre ${MIN_SIZE} y ${MAX_SIZE}.`, "error");
      return;
    }

    loadArray(createRandomArray(numericSize), "Arreglo aleatorio generado.");
  };

  const handleLoadCustom = () => {
    const parts = customInput
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);

    if (parts.length === 0) {
      showMessage("El arreglo esta vacio.", "error");
      return;
    }

    const values = parts.map((part) => Number(part));
    if (values.some((value) => Number.isNaN(value))) {
      showMessage("Todos los elementos deben ser numericos.", "error");
      return;
    }

    loadArray(values, "Arreglo personalizado cargado.");
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      if (!Array.isArray(parsed.array)) {
        showMessage('JSON invalido. Usa el formato: { "array": [10, 5, 30] }', "error");
        return;
      }

      const values = parsed.array.map((value) => Number(value));
      if (values.some((value) => Number.isNaN(value))) {
        showMessage("Todos los elementos del archivo deben ser numericos.", "error");
        return;
      }

      loadArray(values, "Arreglo importado correctamente.");
    } catch {
      showMessage("Archivo JSON invalido.", "error");
    } finally {
      event.target.value = "";
    }
  };

  const handleExport = () => {
    if (!array.length) {
      showMessage("No hay arreglo para exportar.", "error");
      return;
    }

    const blob = new Blob([JSON.stringify({ array: visibleArray }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sorts_array.json";
    link.click();
    URL.revokeObjectURL(url);
    showMessage("Arreglo exportado en formato JSON.", "success");
  };

  const handleClear = () => {
    setArray([]);
    setOriginalArray([]);
    setSteps([]);
    setStepIndex(-1);
    setStepLog([]);
    setIsRunning(false);
    setHasStarted(false);
    setElapsedMs(0);
    elapsedBeforeRunRef.current = 0;
    startedAtRef.current = null;
    showMessage("Arreglo limpiado.", "info");
  };

  const handlePlay = () => {
    if (!array.length) {
      showMessage("Primero genera, carga o importa un arreglo.", "error");
      return;
    }

    if (isFinished) return;

    if (!steps.length) {
      const generatedSteps = buildSortingSteps(array, algorithm, order);
      setSteps(generatedSteps);
      setOriginalArray(array);
      setStepIndex(-1);
      setStepLog([]);
      setHasStarted(true);
    }

    setIsRunning(true);
    startedAtRef.current = Date.now();
  };

  const handlePause = () => {
    if (!isRunning) return;
    const nextElapsed = elapsedBeforeRunRef.current + (Date.now() - startedAtRef.current);
    elapsedBeforeRunRef.current = nextElapsed;
    setElapsedMs(nextElapsed);
    startedAtRef.current = null;
    setIsRunning(false);
  };

  const handleReset = () => {
    const baseArray = originalArray.length ? originalArray : array;
    setArray(baseArray);
    setSteps([]);
    setStepIndex(-1);
    setStepLog([]);
    setIsRunning(false);
    setHasStarted(false);
    setElapsedMs(0);
    elapsedBeforeRunRef.current = 0;
    startedAtRef.current = null;
  };

  useEffect(() => {
    if (!isRunning) return undefined;

    const timer = window.setInterval(() => {
      setElapsedMs(elapsedBeforeRunRef.current + (Date.now() - startedAtRef.current));
    }, 100);

    return () => window.clearInterval(timer);
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning || !steps.length) return undefined;

    const timer = window.setTimeout(() => {
      setStepIndex((current) => {
        const next = current + 1;
        if (next >= steps.length) {
          setIsRunning(false);
          return current;
        }

        const nextStep = steps[next];
        setArray(nextStep.array);
        setStepLog((log) => [...log, nextStep.description]);

        if (nextStep.type === "done") {
          const nextElapsed = elapsedBeforeRunRef.current + (Date.now() - startedAtRef.current);
          elapsedBeforeRunRef.current = nextElapsed;
          setElapsedMs(nextElapsed);
          setIsRunning(false);
          startedAtRef.current = null;
        }

        return next;
      });
    }, STEP_DELAY);

    return () => window.clearTimeout(timer);
  }, [isRunning, stepIndex, steps]);

  const visibleLog = useMemo(() => {
    if (!isFinished) return stepLog.slice(-8);
    return stepLog;
  }, [isFinished, stepLog]);

  return (
    <Page>
      <Toolbar>
        <TitleGroup>
          <span>Algoritmos de ordenamiento</span>
          <h1>Sorts</h1>
        </TitleGroup>

        <ControlGroup>
          <Select
            value={algorithm}
            onChange={(event) => setAlgorithm(event.target.value)}
            disabled={controlsLocked || hasStarted}
            aria-label="Algoritmo"
          >
            {Object.entries(SORT_ALGORITHMS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>

          <Select
            value={order}
            onChange={(event) => setOrder(event.target.value)}
            disabled={controlsLocked || hasStarted}
            aria-label="Orden"
          >
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </Select>

          <IconButton onClick={handlePlay} disabled={isRunning || isFinished} title="Play">
            <FaPlay />
          </IconButton>
          <IconButton onClick={handlePause} disabled={!isRunning} title="Pausar">
            <FaPause />
          </IconButton>
          <IconButton onClick={handleReset} disabled={!array.length} title="Reiniciar">
            <FaRedo />
          </IconButton>
          <HelpButton onClick={() => setShowHelp(true)} title="Ayuda">
            <FaQuestion />
          </HelpButton>
        </ControlGroup>
      </Toolbar>

      <Workspace>
        <MainColumn>
          <ConfigPanel>
            <PanelSection>
              <SectionTitle>
                <FaRandom />
                Aleatorio
              </SectionTitle>
              <InlineControls>
                <Field>
                  <label>Tamano</label>
                  <input
                    type="number"
                    min={MIN_SIZE}
                    max={MAX_SIZE}
                    value={size}
                    disabled={controlsLocked}
                    onChange={(event) => setSize(event.target.value)}
                  />
                </Field>
                <PrimaryButton onClick={handleGenerateRandom} disabled={controlsLocked}>
                  Generar arreglo
                </PrimaryButton>
              </InlineControls>
            </PanelSection>

            <PanelSection>
              <SectionTitle>Personalizado</SectionTitle>
              <CustomRow>
                <TextInput
                  value={customInput}
                  disabled={controlsLocked}
                  onChange={(event) => setCustomInput(event.target.value)}
                  placeholder="10, 5, 30, 2, 15"
                />
                <PrimaryButton onClick={handleLoadCustom} disabled={controlsLocked}>
                  Cargar arreglo
                </PrimaryButton>
              </CustomRow>
            </PanelSection>

            <PanelSection>
              <SectionTitle>Importar/exportar</SectionTitle>
              <FileActions>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImport}
                  hidden
                />
                <SecondaryButton onClick={() => fileInputRef.current?.click()} disabled={controlsLocked}>
                  <FaUpload /> Importar JSON
                </SecondaryButton>
                <SecondaryButton onClick={handleExport} disabled={!array.length}>
                  <FaDownload /> Exportar JSON
                </SecondaryButton>
                <DangerButton onClick={handleClear} disabled={controlsLocked || !array.length}>
                  <FaTrash /> Limpiar
                </DangerButton>
              </FileActions>
            </PanelSection>
          </ConfigPanel>

          {message && <Message $type={message.type}>{message.text}</Message>}

          <SortBoard array={visibleArray} activeIndices={activeIndices} isFinished={isFinished} />
        </MainColumn>

        {hasStarted && (
          <SortStatsPanel
            elapsedMs={elapsedMs}
            originalArray={originalArray}
            currentArray={visibleArray}
            algorithmLabel={SORT_ALGORITHMS[algorithm]}
            orderLabel={orderLabels[order]}
            stepsCount={Math.max(stepIndex + 1, 0)}
            stepLog={visibleLog}
            isFinished={isFinished}
          />
        )}
      </Workspace>

      {showHelp && (
        <HelpOverlay onClick={() => setShowHelp(false)}>
          <HelpModal onClick={(event) => event.stopPropagation()}>
            <HelpHeader>
              <h2>
                <FaQuestion /> Como usar Sorts
              </h2>
              <CloseButton onClick={() => setShowHelp(false)} title="Cerrar">
                <FaTimes />
              </CloseButton>
            </HelpHeader>

            <HelpBody>
              <HelpStep>
                <strong>1. Crea un arreglo</strong>
                <p>
                  Genera uno aleatorio indicando el <em>Tamano</em> (entre {MIN_SIZE} y{" "}
                  {MAX_SIZE}) y pulsando <em>Generar arreglo</em>, o escribe tus propios
                  numeros separados por comas en <em>Personalizado</em> y pulsa{" "}
                  <em>Cargar arreglo</em>. Los valores deben estar entre {MIN_VALUE} y{" "}
                  {MAX_VALUE}.
                </p>
              </HelpStep>

              <HelpStep>
                <strong>2. Elige algoritmo y orden</strong>
                <p>
                  En la barra superior selecciona el algoritmo de ordenamiento y si quieres
                  un orden <em>Ascendente</em> o <em>Descendente</em>. Debes elegirlos antes
                  de iniciar la animacion.
                </p>
              </HelpStep>

              <HelpStep>
                <strong>3. Controla la animacion</strong>
                <p>
                  Usa <FaPlay /> para iniciar o reanudar, <FaPause /> para pausar y{" "}
                  <FaRedo /> para reiniciar al arreglo original. Las barras resaltadas
                  muestran los elementos que se estan comparando o intercambiando en cada
                  paso.
                </p>
              </HelpStep>

              <HelpStep>
                <strong>4. Revisa las estadisticas</strong>
                <p>
                  Mientras se ejecuta veras un panel con el tiempo transcurrido, la cantidad
                  de pasos y un registro de las operaciones realizadas.
                </p>
              </HelpStep>

              <HelpStep>
                <strong>5. Importar / exportar</strong>
                <p>
                  Puedes <em>Importar JSON</em> con el formato{" "}
                  <code>{'{ "array": [10, 5, 30] }'}</code>, <em>Exportar JSON</em> el
                  arreglo actual o <em>Limpiar</em> para empezar de cero.
                </p>
              </HelpStep>
            </HelpBody>
          </HelpModal>
        </HelpOverlay>
      )}
    </Page>
  );
}

const Page = styled.div`
  min-height: calc(100vh - 64px);
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 18px;
  background:
    radial-gradient(circle at 20% 20%, rgba(88, 166, 255, 0.1), transparent 28%),
    linear-gradient(180deg, #050810 0%, #0d1117 100%);
  color: var(--text-primary);
`;

const Toolbar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 18px;
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  box-shadow: var(--shadow-sm);

  @media (max-width: 900px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  span {
    color: var(--text-secondary);
    font-size: 0.78rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  h1 {
    margin: 0;
    color: var(--text-primary);
    font-size: 1.6rem;
    line-height: 1.1;
  }
`;

const ControlGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
`;

const Select = styled.select`
  height: 40px;
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-primary);
  padding: 0 12px;
  font-weight: 700;
  outline: none;

  option {
    color: #0d1117;
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const Workspace = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  gap: 16px;
  overflow: hidden;

  @media (max-width: 1024px) {
    overflow: auto;
    flex-direction: column;
  }
`;

const MainColumn = styled.div`
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const ConfigPanel = styled.section`
  display: grid;
  grid-template-columns: minmax(220px, 0.8fr) minmax(260px, 1.2fr) minmax(240px, 1fr);
  gap: 12px;

  @media (max-width: 1180px) {
    grid-template-columns: 1fr;
  }
`;

const PanelSection = styled.div`
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  background: rgba(13, 17, 23, 0.72);
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-primary);
  font-size: 0.94rem;
  margin: 0;
`;

const InlineControls = styled.div`
  display: flex;
  align-items: end;
  gap: 10px;
  flex-wrap: wrap;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  label {
    color: var(--text-secondary);
    font-size: 0.78rem;
    font-weight: 800;
  }

  input {
    width: 90px;
    height: 38px;
    border: 1px solid var(--glass-border);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.06);
    color: var(--text-primary);
    padding: 0 10px;
    font-weight: 700;
    outline: none;
  }
`;

const CustomRow = styled.div`
  display: grid;
  grid-template-columns: minmax(160px, 1fr) auto;
  gap: 10px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const TextInput = styled.input`
  min-width: 0;
  height: 40px;
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-primary);
  padding: 0 12px;
  outline: none;
`;

const FileActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const buttonBase = `
  min-height: 40px;
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0 13px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 800;
  cursor: pointer;
  transition: all var(--transition-fast);

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  &:not(:disabled):hover {
    transform: translateY(-1px);
  }
`;

const PrimaryButton = styled.button`
  ${buttonBase}
  background: var(--accent-color);
  color: #fff;

  &:not(:disabled):hover {
    background: var(--accent-hover);
    box-shadow: 0 8px 22px var(--accent-glow);
  }
`;

const SecondaryButton = styled.button`
  ${buttonBase}
  background: rgba(255, 255, 255, 0.07);
  border-color: var(--glass-border);
  color: var(--text-primary);

  &:not(:disabled):hover {
    background: rgba(255, 255, 255, 0.12);
  }
`;

const DangerButton = styled.button`
  ${buttonBase}
  background: rgba(239, 68, 68, 0.13);
  border-color: rgba(239, 68, 68, 0.32);
  color: #fecaca;

  &:not(:disabled):hover {
    background: rgba(239, 68, 68, 0.22);
  }
`;

const IconButton = styled.button`
  width: 40px;
  height: 40px;
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);

  &:not(:disabled):hover {
    color: #fff;
    background: var(--accent-color);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

const HelpButton = styled.button`
  width: 40px;
  height: 40px;
  border: 1px solid rgba(88, 166, 255, 0.4);
  border-radius: 8px;
  background: rgba(88, 166, 255, 0.14);
  color: #58a6ff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    color: #fff;
    background: var(--accent-color);
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
  background: rgba(2, 4, 10, 0.7);
  backdrop-filter: blur(4px);
`;

const HelpModal = styled.div`
  width: min(640px, 100%);
  max-height: 85vh;
  overflow: auto;
  border: 1px solid var(--glass-border);
  border-radius: 14px;
  background: linear-gradient(180deg, #0d1117 0%, #11161f 100%);
  box-shadow: var(--shadow-lg, 0 20px 60px rgba(0, 0, 0, 0.5));
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
  background: rgba(13, 17, 23, 0.92);

  h2 {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    font-size: 1.15rem;
    color: var(--text-primary);

    svg {
      color: #58a6ff;
    }
  }
`;

const CloseButton = styled.button`
  width: 34px;
  height: 34px;
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
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

  svg {
    vertical-align: -1px;
    color: #58a6ff;
  }

  code {
    padding: 1px 6px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.08);
    color: #c9d1d9;
    font-size: 0.85rem;
  }

  em {
    color: var(--text-primary);
    font-style: normal;
    font-weight: 700;
  }
`;

const Message = styled.div`
  border-radius: 10px;
  padding: 10px 12px;
  border: 1px solid
    ${(props) =>
      props.$type === "error"
        ? "rgba(239, 68, 68, 0.35)"
        : props.$type === "success"
          ? "rgba(46, 160, 67, 0.35)"
          : "rgba(88, 166, 255, 0.3)"};
  background: ${(props) =>
    props.$type === "error"
      ? "rgba(239, 68, 68, 0.13)"
      : props.$type === "success"
        ? "rgba(35, 134, 54, 0.16)"
        : "rgba(88, 166, 255, 0.12)"};
  color: var(--text-primary);
  font-weight: 700;
  font-size: 0.92rem;
`;
