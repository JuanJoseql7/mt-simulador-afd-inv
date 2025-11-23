// Simulador de MT que emula un AFD para el Regex INV-[0-9]+
// Restricciones MT: cabezal solo se mueve a la derecha; escritura identidad.
// Cinta: entrada + símbolo BLANCO "_" para decidir aceptación/rechazo.

let cinta = [];           // Cinta como arreglo de símbolos
let cabezal = 0;          // Posición del cabezal
let estado = "q0";        // Estado actual
let detenido = false;     // Bandera de detención
let aceptado = false;     // Bandera de aceptación

// Elementos UI
const contenedorCinta = document.getElementById("tapeContainer");
const indicadorCabezal = document.getElementById("headIndicator");
const estadoActual = document.getElementById("currentState");
const posicionCabezal = document.getElementById("headPos");
const mensajeResultado = document.getElementById("resultMsg");
const areaLog = document.getElementById("logArea");
const entradaTexto = document.getElementById("inputTape");
const btnCargar = document.getElementById("btnLoad");
const btnPaso = document.getElementById("btnStep");
const btnEjecutar = document.getElementById("btnRun");
const btnReiniciar = document.getElementById("btnReset");

// Alfabeto y utilidades
const DIGITOS = new Set(["0","1","2","3","4","5","6","7","8","9"]);
const BLANCO = "_";
const esDigito = ch => DIGITOS.has(ch);

// Tabla de reglas (función de transición)
const reglas = {
  q0: {
    "I": { escribir: "I", mover: "R", siguiente: "qI" },
    defecto: { error: true }
  },
  qI: {
    "N": { escribir: "N", mover: "R", siguiente: "qIN" },
    defecto: { error: true }
  },
  qIN: {
    "V": { escribir: "V", mover: "R", siguiente: "qINV" },
    defecto: { error: true }
  },
  qINV: {
    "-": { escribir: "-", mover: "R", siguiente: "qINVdash" },
    defecto: { error: true }
  },
  qINVdash: {
    digito: { escribir: "igual", mover: "R", siguiente: "qA" },       // al menos un dígito
    [BLANCO]: { escribir: BLANCO, mover: "R", siguiente: "qReject" }, // vacío: no cumple '+'
    defecto: { error: true }
  },
  qA: {
    digito: { escribir: "igual", mover: "R", siguiente: "qA" },        // más dígitos
    [BLANCO]: { escribir: BLANCO, mover: "R", siguiente: "qAccept" },  // fin: acepta
    defecto: { error: true }
  },
  qE: {
    [BLANCO]: { escribir: BLANCO, mover: "R", siguiente: "qReject" },
    defecto: { error: true }
  },
  qAccept: {},
  qReject: {}
};

// Render de la cinta y estado
function dibujarCinta() {
  contenedorCinta.innerHTML = "";
  cinta.forEach((simbolo, i) => {
    const celda = document.createElement("div");
    celda.className = "celda" + (i === cabezal ? " activa" : "");
    celda.textContent = simbolo;
    contenedorCinta.appendChild(celda);
  });

  // Posiciona el indicador del cabezal cerca de la celda activa
  const celdaActiva = contenedorCinta.children[cabezal];
  if (celdaActiva) {
    indicadorCabezal.style.left = `${celdaActiva.offsetLeft + 12}px`;
    indicadorCabezal.style.top = `${contenedorCinta.offsetTop + 6}px`;
  }

  estadoActual.textContent = estado;
  posicionCabezal.textContent = String(cabezal);
}

// Log y resultado
function log(mensaje) {
  areaLog.textContent += mensaje + "\n";
  areaLog.scrollTop = areaLog.scrollHeight;
}

function setResultado(texto, tipo = "") {
  mensajeResultado.className = "badge";
  if (tipo === "ok") mensajeResultado.classList.add("ok");
  else if (tipo === "err") mensajeResultado.classList.add("err");
  else if (tipo === "warn") mensajeResultado.classList.add("warn");
  mensajeResultado.textContent = texto;
}

// Función de transición
function funcionTransicion(estadoActual, simboloActual) {
  const tabla = reglas[estadoActual];
  if (!tabla) return { escribir: simboloActual, mover: "R", siguiente: "qReject" };

  // Caso dígito
  if (esDigito(simboloActual) && tabla["digito"]) {
    const r = tabla["digito"];
    return { escribir: simboloActual, mover: r.mover, siguiente: r.siguiente };
  }

  // Regla exacta por símbolo
  if (Object.prototype.hasOwnProperty.call(tabla, simboloActual)) {
    const r = tabla[simboloActual];
    const escribir = r.escribir === "igual" ? simboloActual : r.escribir;
    return { escribir, mover: r.mover, siguiente: r.siguiente };
  }

  // Por defecto: error/trampa
  if (tabla.defecto && tabla.defecto.error) {
    return { escribir: simboloActual, mover: "R", siguiente: "qE" };
  }

  return { escribir: simboloActual, mover: "R", siguiente: "qE" };
}

// Un paso de ejecución
function paso() {
  if (detenido) return;

  // Si ya estamos en estado terminal, mostrar y detener
  if (estado === "qAccept" || estado === "qReject") {
    detenido = true;
    aceptado = (estado === "qAccept");
    setResultado(aceptado ? "Cadena aceptada" : "Cadena rechazada", aceptado ? "ok" : "err");
    return;
  }

  const simboloActual = cinta[cabezal] ?? BLANCO;
  const res = funcionTransicion(estado, simboloActual);

  // Escritura identidad (opcional; mantenemos el símbolo)
  const simboloEscribir = res.escribir === "igual" ? simboloActual : res.escribir;
  if (cinta[cabezal] !== undefined) cinta[cabezal] = simboloEscribir;

  // Mover a la derecha si corresponde
  if (res.mover === "R") {
    cabezal += 1;
    // Garantiza que exista BLANCO al final
    if (cabezal >= cinta.length) cinta.push(BLANCO);
  }

  // Cambiar estado
  const estadoPrevio = estado;
  const posPrevio = cabezal - (res.mover === "R" ? 1 : 0);
  estado = res.siguiente;

  log(`(${estadoPrevio}, '${simboloActual}', pos=${posPrevio}) -> (${estado}, move=${res.mover})`);
  dibujarCinta();

  // Revisión de estado terminal
  if (estado === "qAccept" || estado === "qReject") {
    detenido = true;
    aceptado = (estado === "qAccept");
    setResultado(aceptado ? "Cadena aceptada" : "Cadena rechazada", aceptado ? "ok" : "err");
  }
}

// Ejecutar automáticamente
function ejecutar() {
  let seguridad = 500; // límite de seguridad para evitar bucles
  while (!detenido && seguridad-- > 0) paso();
  if (!detenido) {
    detenido = true;
    setResultado("Ejecución detenida por seguridad", "warn");
  }
}

// Reiniciar
function reiniciar() {
  cinta = [BLANCO];
  cabezal = 0;
  estado = "q0";
  detenido = false;
  aceptado = false;
  areaLog.textContent = "";
  setResultado("—");
  dibujarCinta();
}

// Cargar la cinta desde el input
function cargarCinta() {
  const texto = (entradaTexto.value || "").trim();
  // Sanitización simple: permitir I,N,V,- y dígitos (lo demás se procesará como error en la MT)
  const permitido = /[INV\-0-9]/;
  const invalido = [...texto].some(ch => !permitido.test(ch));
  if (invalido) {
    // Nota: no bloqueamos la entrada; la MT mostrará rechazo al procesar símbolos no esperados
    setResultado("Entrada con símbolos no válidos", "warn");
  }
  cinta = [...texto, BLANCO];  // añade blanco lógico al final
  cabezal = 0;
  estado = "q0";
  detenido = false;
  aceptado = false;
  areaLog.textContent = "";
  dibujarCinta();
}

// Eventos
btnCargar.addEventListener("click", cargarCinta);
btnPaso.addEventListener("click", paso);
btnEjecutar.addEventListener("click", ejecutar);
btnReiniciar.addEventListener("click", reiniciar);

// Inicio
reiniciar();

