export const existeAristaContraria = (aristas, from, to) =>
  aristas.some((ar) => ar.from === to && ar.to === from);

export const calcularPosicionMenu = (nodoX, nodoY, offsetX, offsetY, tipo = "nodo") => {
  const menuWidth = 240;
  const menuHeight = tipo === "nodo" ? 320 : 220;
  const padding = 16;
  const nodoRadius = 40;

  const nodoViewportX = nodoX + offsetX;
  const nodoViewportY = nodoY + offsetY;

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let menuX = nodoViewportX + nodoRadius + 10;
  let menuY = nodoViewportY - menuHeight / 2;

  if (menuX + menuWidth + padding > viewportWidth) {
    menuX = nodoViewportX - nodoRadius - menuWidth - 10;
  }
  if (menuX < padding) {
    menuX = padding;
  }
  if (menuX + menuWidth + padding > viewportWidth) {
    menuX = viewportWidth - menuWidth - padding;
  }

  if (menuY < padding) {
    menuY = padding;
  }
  if (menuY + menuHeight + padding > viewportHeight) {
    menuY = viewportHeight - menuHeight - padding;
  }

  return { x: menuX, y: menuY };
};

export const calcularPosicionMenuArista = (clickX, clickY, tipo = "arista") => {
  const menuWidth = 240;
  const menuHeight = 220;
  const padding = 16;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let menuX = clickX + 20;
  let menuY = clickY - menuHeight / 2;

  if (menuX + menuWidth + padding > viewportWidth) {
    menuX = clickX - menuWidth - 20;
  }
  if (menuX < padding) {
    menuX = padding;
  }
  if (menuY < padding) {
    menuY = padding;
  }
  if (menuY + menuHeight + padding > viewportHeight) {
    menuY = viewportHeight - menuHeight - padding;
  }

  return { x: menuX, y: menuY };
};
