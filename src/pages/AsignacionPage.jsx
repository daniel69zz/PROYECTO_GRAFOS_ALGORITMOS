import { useState, useCallback } from "react";
import styled, { keyframes, css } from "styled-components";
import { resolverAsignacion, validarMatriz } from "../utils/hungaro";
import { Notification } from "../components/Notification";
import {
  FiGrid,
  FiPlay,
  FiTrash2,
  FiChevronDown,
  FiChevronUp,
  FiArrowRight,
} from "react-icons/fi";

const DEFAULT_SIZE = 3;

function crearMatrizVacia(n) {
  return Array.from({ length: n }, () => Array(n).fill(0));
}

function crearNombres(n, prefijo) {
  return Array.from({ length: n }, (_, i) => `${prefijo} ${i + 1}`);
}

export function AsignacionPage() {
  const [tamano, setTamano] = useState(DEFAULT_SIZE);
  const [matriz, setMatriz] = useState(crearMatrizVacia(DEFAULT_SIZE));
  const [nombreFilas, setNombreFilas] = useState(
    crearNombres(DEFAULT_SIZE, "Trabajador")
  );
  const [nombreColumnas, setNombreColumnas] = useState(
    crearNombres(DEFAULT_SIZE, "Tarea")
  );
  const [modo, setModo] = useState("minimizar");
  const [resultado, setResultado] = useState(null);
  const [notification, setNotification] = useState(null);
  const [mostrarPasos, setMostrarPasos] = useState(false);

  const handleTamanoChange = useCallback(
    (nuevoTamano) => {
      const n = Number(nuevoTamano);
      if (n < 2 || n > 10) return;
      setTamano(n);
      setResultado(null);

      // Preservar datos existentes al redimensionar
      const nuevaMatriz = Array.from({ length: n }, (_, i) =>
        Array.from({ length: n }, (_, j) =>
          i < matriz.length && j < (matriz[0]?.length ?? 0) ? matriz[i][j] : 0
        )
      );
      setMatriz(nuevaMatriz);

      const nuevasFilas = Array.from({ length: n }, (_, i) =>
        i < nombreFilas.length ? nombreFilas[i] : `Trabajador ${i + 1}`
      );
      const nuevasCols = Array.from({ length: n }, (_, i) =>
        i < nombreColumnas.length ? nombreColumnas[i] : `Tarea ${i + 1}`
      );
      setNombreFilas(nuevasFilas);
      setNombreColumnas(nuevasCols);
    },
    [matriz, nombreFilas, nombreColumnas]
  );

  const handleCeldaChange = useCallback((i, j, value) => {
    setMatriz((prev) => {
      const nueva = prev.map((f) => [...f]);
      nueva[i][j] = value === "" ? "" : Number(value);
      return nueva;
    });
    setResultado(null);
  }, []);

  const handleNombreFilaChange = useCallback((i, value) => {
    setNombreFilas((prev) => {
      const nuevo = [...prev];
      nuevo[i] = value;
      return nuevo;
    });
  }, []);

  const handleNombreColumnaChange = useCallback((j, value) => {
    setNombreColumnas((prev) => {
      const nuevo = [...prev];
      nuevo[j] = value;
      return nuevo;
    });
  }, []);

  const handleResolver = () => {
    // Convertir todas las celdas a números
    const matrizNum = matriz.map((fila) => fila.map((v) => Number(v)));

    const validacion = validarMatriz(matrizNum);
    if (!validacion.valida) {
      setNotification({ message: validacion.error, type: "error" });
      return;
    }

    try {
      const res = resolverAsignacion(matrizNum, modo);
      setResultado(res);
      setNotification({
        message: `✅ Asignación óptima encontrada. Costo total: ${res.costoTotal}`,
        type: "success",
      });
    } catch (err) {
      setNotification({
        message: `Error al resolver: ${err.message}`,
        type: "error",
      });
    }
  };

  const handleLimpiar = () => {
    setMatriz(crearMatrizVacia(tamano));
    setNombreFilas(crearNombres(tamano, "Trabajador"));
    setNombreColumnas(crearNombres(tamano, "Tarea"));
    setResultado(null);
    setMostrarPasos(false);
  };

  const esCeldaAsignada = (i, j) => {
    if (!resultado) return false;
    return resultado.asignaciones.some((a) => a.fila === i && a.columna === j);
  };

  return (
    <Container>
      <BackgroundGlow />
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <Hero>
        <HeroContent>
          <HeroIcon>📋</HeroIcon>
          <h1>Algoritmo de Asignación</h1>
          <HeroSubtitle>
            Resuelve problemas de asignación usando el Algoritmo Húngaro.
            Optimiza asignaciones para <strong>minimizar</strong> o{" "}
            <strong>maximizar</strong> el costo total.
          </HeroSubtitle>
        </HeroContent>
      </Hero>

      <Content>
        {/* --- CONFIGURACIÓN --- */}
        <Card>
          <CardHeader>
            <FiGrid />
            <h2>Configuración</h2>
          </CardHeader>

          <ConfigGrid>
            <FormGroup>
              <label>Tamaño de la Matriz (n×n)</label>
              <SizeControls>
                <SizeBtn
                  onClick={() => handleTamanoChange(tamano - 1)}
                  disabled={tamano <= 2}
                >
                  −
                </SizeBtn>
                <SizeDisplay>{tamano}×{tamano}</SizeDisplay>
                <SizeBtn
                  onClick={() => handleTamanoChange(tamano + 1)}
                  disabled={tamano >= 10}
                >
                  +
                </SizeBtn>
              </SizeControls>
            </FormGroup>

            <FormGroup>
              <label>Objetivo</label>
              <RadioGroup>
                <RadioLabel $active={modo === "minimizar"}>
                  <input
                    type="radio"
                    name="modo"
                    value="minimizar"
                    checked={modo === "minimizar"}
                    onChange={() => {
                      setModo("minimizar");
                      setResultado(null);
                    }}
                  />
                  <RadioIcon>⚡</RadioIcon>
                  Minimizar
                </RadioLabel>
                <RadioLabel $active={modo === "maximizar"}>
                  <input
                    type="radio"
                    name="modo"
                    value="maximizar"
                    checked={modo === "maximizar"}
                    onChange={() => {
                      setModo("maximizar");
                      setResultado(null);
                    }}
                  />
                  <RadioIcon>🏆</RadioIcon>
                  Maximizar
                </RadioLabel>
              </RadioGroup>
            </FormGroup>
          </ConfigGrid>
        </Card>

        {/* --- MATRIZ EDITABLE --- */}
        <Card>
          <CardHeader>
            <FiGrid />
            <h2>Matriz de Costos</h2>
          </CardHeader>

          <MatrizWrapper>
            <MatrizTable>
              <thead>
                <tr>
                  <MatrizCorner />
                  {nombreColumnas.map((nombre, j) => (
                    <MatrizColHeader key={j}>
                      <HeaderInput
                        value={nombre}
                        onChange={(e) =>
                          handleNombreColumnaChange(j, e.target.value)
                        }
                        title={`Editar nombre de columna ${j + 1}`}
                      />
                    </MatrizColHeader>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matriz.map((fila, i) => (
                  <tr key={i}>
                    <MatrizRowHeader>
                      <HeaderInput
                        value={nombreFilas[i]}
                        onChange={(e) =>
                          handleNombreFilaChange(i, e.target.value)
                        }
                        title={`Editar nombre de fila ${i + 1}`}
                      />
                    </MatrizRowHeader>
                    {fila.map((val, j) => (
                      <MatrizCelda
                        key={j}
                        $asignada={esCeldaAsignada(i, j)}
                      >
                        <CeldaInput
                          type="number"
                          min="0"
                          value={val}
                          onChange={(e) =>
                            handleCeldaChange(i, j, e.target.value)
                          }
                          $asignada={esCeldaAsignada(i, j)}
                        />
                      </MatrizCelda>
                    ))}
                  </tr>
                ))}
              </tbody>
            </MatrizTable>
          </MatrizWrapper>

          <ButtonGroup>
            <PrimaryButton onClick={handleResolver} id="btn-resolver">
              <FiPlay /> Resolver
            </PrimaryButton>
            <SecondaryButton onClick={handleLimpiar} id="btn-limpiar">
              <FiTrash2 /> Limpiar
            </SecondaryButton>
          </ButtonGroup>
        </Card>

        {/* --- RESULTADOS --- */}
        {resultado && (
          <ResultCard $visible={true}>
            <CardHeader>
              <ResultIcon>
                {modo === "maximizar" ? "🏆" : "⚡"}
              </ResultIcon>
              <h2>Resultado — {modo === "maximizar" ? "Maximización" : "Minimización"}</h2>
            </CardHeader>

            <CostoTotal>
              <CostoLabel>Costo Total Óptimo</CostoLabel>
              <CostoValor>{resultado.costoTotal}</CostoValor>
            </CostoTotal>

            <AsignacionesList>
              <h3>Asignaciones Óptimas</h3>
              {resultado.asignaciones.map((a, idx) => (
                <AsignacionItem key={idx} style={{ animationDelay: `${idx * 0.1}s` }}>
                  <AsignacionBadge>{nombreFilas[a.fila]}</AsignacionBadge>
                  <FiArrowRight style={{ color: "var(--accent-color)", fontSize: "20px" }} />
                  <AsignacionBadge $tipo="destino">
                    {nombreColumnas[a.columna]}
                  </AsignacionBadge>
                  <CostoBadge>Costo: {a.costo}</CostoBadge>
                </AsignacionItem>
              ))}
            </AsignacionesList>

            {/* Pasos del algoritmo */}
            {resultado.pasos.length > 0 && (
              <PasosSection>
                <PasosToggle onClick={() => setMostrarPasos(!mostrarPasos)}>
                  {mostrarPasos ? <FiChevronUp /> : <FiChevronDown />}
                  <span>
                    {mostrarPasos
                      ? "Ocultar pasos del algoritmo"
                      : "Ver pasos del algoritmo (modo educativo)"}
                  </span>
                </PasosToggle>

                {mostrarPasos && (
                  <PasosList>
                    {resultado.pasos.map((paso, idx) => (
                      <PasoItem key={idx}>
                        <PasoNumero>{idx + 1}</PasoNumero>
                        <PasoContenido>
                          <PasoTitulo>{paso.titulo}</PasoTitulo>
                          <PasoDescripcion>{paso.descripcion}</PasoDescripcion>
                          {paso.matriz && (
                            <PasoMatrizWrapper>
                              <PasoMatriz>
                                <tbody>
                                  {paso.matriz.map((fila, i) => (
                                    <tr key={i}>
                                      {fila.map((val, j) => (
                                        <PasoMatrizCelda
                                          key={j}
                                          $esCero={val === 0}
                                        >
                                          {val}
                                        </PasoMatrizCelda>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </PasoMatriz>
                            </PasoMatrizWrapper>
                          )}
                        </PasoContenido>
                      </PasoItem>
                    ))}
                  </PasosList>
                )}
              </PasosSection>
            )}
          </ResultCard>
        )}
      </Content>
    </Container>
  );
}

/* ================================================
   ANIMATIONS
   ================================================ */
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 8px rgba(88, 166, 255, 0.3); }
  50% { box-shadow: 0 0 20px rgba(88, 166, 255, 0.6); }
`;

/* ================================================
   STYLED COMPONENTS
   ================================================ */
const Container = styled.div`
  min-height: calc(100vh - 64px);
  background-color: #050810;
  background-image: radial-gradient(
      circle at 15% 50%,
      rgba(88, 166, 255, 0.08),
      transparent 40%
    ),
    radial-gradient(
      circle at 85% 30%,
      rgba(88, 166, 255, 0.12),
      transparent 40%
    );
  overflow: auto;
  position: relative;
`;

const BackgroundGlow = styled.div`
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 70vw;
  height: 70vw;
  max-width: 700px;
  max-height: 700px;
  background: radial-gradient(
    circle,
    rgba(88, 166, 255, 0.06) 0%,
    transparent 60%
  );
  filter: blur(80px);
  pointer-events: none;
  z-index: 0;
`;

const Hero = styled.header`
  background: linear-gradient(180deg, #0d1117 0%, transparent 100%);
  padding: 80px 30px 50px;
  text-align: center;
  color: var(--text-primary);
  position: relative;
  overflow: hidden;
  z-index: 1;

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    left: 50%;
    transform: translateX(-50%);
    width: 100vw;
    height: 100vw;
    pointer-events: none;
    background: radial-gradient(
      circle,
      rgba(88, 166, 255, 0.1) 0%,
      transparent 60%
    );
    filter: blur(60px);
  }

  @media (max-width: 768px) {
    padding: 60px 20px 30px;
  }
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  h1 {
    font-size: clamp(32px, 7vw, 56px);
    font-weight: 900;
    letter-spacing: -0.03em;
    margin-bottom: 16px;
    background: linear-gradient(180deg, #ffffff 0%, #a5c8ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 0 40px rgba(88, 166, 255, 0.2);
  }
`;

const HeroIcon = styled.div`
  font-size: 56px;
  margin-bottom: 16px;
  filter: drop-shadow(0 4px 12px rgba(88, 166, 255, 0.3));
`;

const HeroSubtitle = styled.p`
  font-size: clamp(16px, 2.5vw, 20px);
  color: var(--text-secondary);
  line-height: 1.7;

  strong {
    color: var(--accent-hover);
  }
`;

const Content = styled.main`
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 24px 80px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 24px 16px 60px;
    gap: 24px;
  }
`;

const Card = styled.section`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px 36px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: ${fadeInUp} 0.6s ease both;

  @media (max-width: 768px) {
    padding: 28px 20px;
    border-radius: 16px;
  }
`;

const ResultCard = styled(Card)`
  border-color: rgba(88, 166, 255, 0.2);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(88, 166, 255, 0.1);
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  svg {
    font-size: 24px;
    color: var(--accent-color);
  }

  h2 {
    font-size: clamp(22px, 3.5vw, 28px);
    font-weight: 800;
    color: var(--text-primary);
    letter-spacing: -0.01em;
  }
`;

const ResultIcon = styled.span`
  font-size: 28px;
`;

const ConfigGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  > label {
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-secondary);
  }
`;

const SizeControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SizeBtn = styled.button`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
  font-size: 22px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background: var(--accent-color);
    border-color: var(--accent-color);
    box-shadow: 0 0 15px var(--accent-glow);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const SizeDisplay = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: var(--accent-hover);
  min-width: 60px;
  text-align: center;
  padding: 8px 16px;
  background: rgba(88, 166, 255, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(88, 166, 255, 0.2);
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 400px) {
    flex-direction: column;
  }
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.2s;
  border: 1px solid
    ${(p) =>
      p.$active ? "rgba(88, 166, 255, 0.4)" : "rgba(255, 255, 255, 0.08)"};
  background: ${(p) =>
    p.$active ? "rgba(88, 166, 255, 0.15)" : "rgba(255, 255, 255, 0.03)"};
  color: ${(p) => (p.$active ? "var(--accent-hover)" : "var(--text-secondary)")};

  input[type="radio"] {
    display: none;
  }

  &:hover {
    background: rgba(88, 166, 255, 0.1);
    border-color: rgba(88, 166, 255, 0.3);
  }
`;

const RadioIcon = styled.span`
  font-size: 18px;
`;

/* ---- MATRIZ ---- */
const MatrizWrapper = styled.div`
  overflow-x: auto;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(0, 0, 0, 0.2);
  padding: 16px;

  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: #30363d;
    border-radius: 4px;
  }
`;

const MatrizTable = styled.table`
  border-collapse: separate;
  border-spacing: 6px;
  width: 100%;
  min-width: max-content;
`;

const MatrizCorner = styled.th`
  width: 110px;
  min-width: 110px;
`;

const MatrizColHeader = styled.th`
  padding: 4px;
  min-width: 80px;
`;

const MatrizRowHeader = styled.td`
  padding: 4px;
  min-width: 110px;
`;

const HeaderInput = styled.input`
  width: 100%;
  background: rgba(88, 166, 255, 0.08);
  border: 1px solid rgba(88, 166, 255, 0.15);
  border-radius: 8px;
  padding: 8px 10px;
  color: var(--accent-hover);
  font-weight: 700;
  font-size: 13px;
  text-align: center;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: var(--accent-color);
    box-shadow: 0 0 10px rgba(88, 166, 255, 0.2);
  }
`;

const MatrizCelda = styled.td`
  padding: 2px;
  transition: all 0.3s;

  ${(p) =>
    p.$asignada &&
    css`
      animation: ${pulseGlow} 2s ease-in-out infinite;
      border-radius: 10px;
    `}
`;

const CeldaInput = styled.input`
  width: 100%;
  min-width: 60px;
  padding: 12px 8px;
  border-radius: 10px;
  border: 1px solid
    ${(p) =>
      p.$asignada ? "rgba(46, 160, 67, 0.6)" : "rgba(255, 255, 255, 0.08)"};
  background: ${(p) =>
    p.$asignada
      ? "rgba(46, 160, 67, 0.2)"
      : "rgba(255, 255, 255, 0.04)"};
  color: ${(p) => (p.$asignada ? "#7ee787" : "var(--text-primary)")};
  font-size: 16px;
  font-weight: ${(p) => (p.$asignada ? "800" : "500")};
  text-align: center;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: var(--accent-color);
    background: rgba(88, 166, 255, 0.08);
    box-shadow: 0 0 12px rgba(88, 166, 255, 0.2);
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield;
`;

/* ---- BOTONES ---- */
const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(135deg, #238636 0%, #2ea043 100%);
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(46, 160, 67, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(46, 160, 67, 0.5);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    font-size: 18px;
  }
`;

const SecondaryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-secondary);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: var(--text-primary);
    border-color: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
  }

  svg {
    font-size: 18px;
  }
`;

/* ---- RESULTADOS ---- */
const CostoTotal = styled.div`
  text-align: center;
  padding: 28px;
  background: linear-gradient(
    135deg,
    rgba(46, 160, 67, 0.1) 0%,
    rgba(88, 166, 255, 0.08) 100%
  );
  border-radius: 20px;
  border: 1px solid rgba(46, 160, 67, 0.2);
`;

const CostoLabel = styled.div`
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--text-secondary);
  margin-bottom: 8px;
`;

const CostoValor = styled.div`
  font-size: clamp(40px, 8vw, 64px);
  font-weight: 900;
  background: linear-gradient(135deg, #7ee787 0%, #58a6ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 40px rgba(126, 231, 135, 0.3);
`;

const AsignacionesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  h3 {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 4px;
  }
`;

const AsignacionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  animation: ${slideIn} 0.4s ease both;
  flex-wrap: wrap;

  &:hover {
    background: rgba(255, 255, 255, 0.03);
    border-color: rgba(88, 166, 255, 0.15);
    transform: translateX(4px);
  }

  transition: all 0.2s;
`;

const AsignacionBadge = styled.span`
  padding: 6px 14px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 14px;
  white-space: nowrap;

  ${(p) =>
    p.$tipo === "destino"
      ? css`
          background: rgba(46, 160, 67, 0.15);
          color: #7ee787;
          border: 1px solid rgba(46, 160, 67, 0.3);
        `
      : css`
          background: rgba(88, 166, 255, 0.15);
          color: var(--accent-hover);
          border: 1px solid rgba(88, 166, 255, 0.3);
        `}
`;

const CostoBadge = styled.span`
  margin-left: auto;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-secondary);
  border: 1px solid rgba(255, 255, 255, 0.06);
`;

/* ---- PASOS ---- */
const PasosSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PasosToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 20px;
  background: rgba(88, 166, 255, 0.06);
  border: 1px solid rgba(88, 166, 255, 0.15);
  border-radius: 14px;
  color: var(--accent-hover);
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  text-align: left;

  svg {
    font-size: 20px;
  }

  &:hover {
    background: rgba(88, 166, 255, 0.1);
    border-color: rgba(88, 166, 255, 0.3);
  }
`;

const PasosList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: ${fadeInUp} 0.4s ease;
`;

const PasoItem = styled.div`
  display: flex;
  gap: 16px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.04);
`;

const PasoNumero = styled.div`
  width: 36px;
  height: 36px;
  min-width: 36px;
  border-radius: 10px;
  background: var(--accent-color);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 16px;
  box-shadow: 0 0 12px var(--accent-glow);
`;

const PasoContenido = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PasoTitulo = styled.h4`
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
`;

const PasoDescripcion = styled.p`
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
`;

const PasoMatrizWrapper = styled.div`
  overflow-x: auto;
  margin-top: 4px;
`;

const PasoMatriz = styled.table`
  border-collapse: separate;
  border-spacing: 4px;
`;

const PasoMatrizCelda = styled.td`
  padding: 6px 12px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  border-radius: 6px;
  min-width: 40px;
  background: ${(p) =>
    p.$esCero
      ? "rgba(46, 160, 67, 0.2)"
      : "rgba(255, 255, 255, 0.04)"};
  color: ${(p) => (p.$esCero ? "#7ee787" : "var(--text-secondary)")};
  border: 1px solid
    ${(p) =>
      p.$esCero
        ? "rgba(46, 160, 67, 0.3)"
        : "rgba(255, 255, 255, 0.05)"};
`;
