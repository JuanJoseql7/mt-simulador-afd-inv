// Simulador de MT que emula un AFD para el Regex INV-[0-9]+
// Restricciones: cabezal solo a la derecha; escritura identidad.

let cinta = [];
let cabezal = 0;
let estado = "q0";
let detenido = false;
let aceptado = false;

// Elementos UI
const contenedorCinta  = document.getElementById("tapeContainer");
const indicadorCabezal = document.getElementById("headIndicator");
const estadoActual     = document.getElementById("currentState");
const posicionCabezal  = document.getElementById("headPos");
const mensajeResultado = document.getElementById("resultMsg");
const areaLog          = document.getElementById("logArea");
const entradaTexto     = document.getElementById("inputTape");
const btnCargar        = document.getElementById("btnLoad");
const btnPaso          = document.getElementById("btnStep");
const btnEjecutar      = document.getElementById("btnRun");
const btnReiniciar     = document.getElementById("btnReset");

// Alfabeto
const DIGITOS = new Set(["0","1","2","3","4","5","6","7","8","9"]);
const BLANCO  = "_";
const esDigito = ch => DIGITOS.has(ch);

// Tabla de reglas
const reglas = {
  q0: { "I": { escribir: "I", mover: "R", siguiente: "qI" }, defecto: { error: true } },
  qI: { "N": { escribir: "N", mover: "R", siguiente: "qIN" }, defecto: { error: true } },
  qIN:{ "V": { escribir: "V", mover: "R", siguiente: "qINV"}, defecto: { error: true } },
  qINV:{ "-": { escribir: "-", mover: "R", siguiente: "qINVdash" }, defecto: { error: true } },
  qINVdash: {
    digito: { escribir: "igual", mover: "R", siguiente: "qA" },
    [BLANCO]: { escribir: BLANCO, mover: "R", siguiente: "qReject" },
    defecto: { error: true }
  },
  qA: {
    digito: { escribir: "igual", mover: "R", siguiente: "qA" },
    [BLANCO]: { escribir: BLANCO, mover: "R", siguiente: "qAccept" },
    defecto: { error: true }
  },
  qE: {
    [BLANCO]: { escribir: BLANCO, mover: "R", siguiente: "qReject" },
    defecto: { error: true }
  },
  qAccept: {}, qReject: {}
};

// Dibujar cinta
function dibujarCinta() {
  contenedorCinta.innerHTML = "";
  cinta.forEach((simbolo, i) => {
    const celda = document.createElement("div");
    celda.className = "celda" + (i === cabezal ? " activa" : "");
    celda.textContent = simbolo;
    contenedorCinta.appendChild(celda);
  });

  const celdaActiva = contenedorCinta.children[cabezal];
  if (celdaActiva) {
    const rect = celdaActiva.getBoundingClientRect();
    const parent = contenedorCinta.getBoundingClientRect();
    indicadorCabezal.style.left = `${rect.left - parent.left + rect.width/2 - 6}px`;
    indicadorCabezal.style.top = `-20px`;
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
function funcionTransicion(est, simb) {
  const tabla = reglas[est];
  if (!tabla) return { escribir: simb, mover: "R", siguiente: "qReject" };
  if (esDigito(simb) && tabla["digito"]) {
    const r = tabla["digito"];
    return { escribir: simb, mover: r.mover, siguiente: r.siguiente };
  }
  if (Object.prototype.hasOwnProperty.call(tabla, simb)) {
    const r = tabla[simb];
    const escribir = r.escribir === "igual" ? simb : r.escribir;
    return { escribir, mover: r.mover, siguiente: r.siguiente };
  }
  if (tabla.defecto && tabla.defecto.error) {
    return { escribir: simb, mover: "R", siguiente: "qE" };
  }
  return { escribir: simb, mover: "R", siguiente: "qE" };
}

// Paso
function paso() {
  if (detenido) return;
  if (estado === "qAccept" || estado === "qReject") {
    detenido = true;
    aceptado = (estado === "qAccept");
    setResultado(aceptado ? "Cadena aceptada" : "Cadena rechazada", aceptado ? "ok" : "err");
    return;
  }
  const simboloActual = cinta[cabezal] ?? BLANCO;
  const res = funcionTransicion(estado, simboloActual);
  const escribir = res.escribir === "igual" ? simboloActual : res.escribir;
  if (cinta[cabezal] !== undefined) cinta[cabezal] = escribir;
  if (res.mover === "R") {
    cabezal++;
    if (cabezal >= cinta.length) cinta.push(
        const estadoPrevio = estado;
  estado = res.siguiente;

  log(`(${estadoPrevio}, '${simboloActual}', pos=${posPrevio}) -> (${estado}, move=${res.mover})`);
  dibujarCinta();

  // Estado terminal
  if (estado === "qAccept" || estado === "qReject") {
    detenido = true;
    aceptado = (estado === "qAccept");
    setResultado(aceptado ? "Cadena aceptada" : "Cadena rechazada", aceptado ? "ok" : "err");
  }
}

// Ejecutar automáticamente
function ejecutar() {
  if (detenido) return;
  let seguridad = 500;
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

// Cargar cinta desde input
function cargarCinta() {
  const texto = (entradaTexto.value || "").trim();
  const permitido = /[INV\-0-9]/;
  const invalido = [...texto].some(ch => !permitido.test(ch));
  if (invalido) {
    setResultado("Entrada con símbolos no válidos", "warn");
  }
  cinta = [...texto, BLANCO];
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


