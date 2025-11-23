let cinta = [];
let cabezal = 0;
let estado = "q0";
let detenido = false;
let aceptado = false;

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

const DIGITOS = new Set(["0","1","2","3","4","5","6","7","8","9"]);
const BLANCO = "_";
const esDigito = ch => DIGITOS.has(ch);

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

function dibujarCinta() {
  contenedorCinta.innerHTML = "";
  cinta.forEach((simbolo, i) => {
    const celda = document.createElement("div");
    celda.className = "celda" + (i === cabezal ? " activa" : "");
    celda.textContent = simbolo;
    contenedorCinta.appendChild(celda);
  });

