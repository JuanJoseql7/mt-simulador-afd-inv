let cinta = [];
let cabezal = 0;
let estado = "q0";
let detenido = false;
let aceptado = false;

const DIGITOS = new Set(["0","1","2","3","4","5","6","7","8","9"]);
const BLANCO = "_";
const esDigito = ch => DIGITOS.has(ch);

// Tabla de reglas para INV-[0-9]+_
const reglas = {
  q0: { "I": { escribir: "I", mover: "R", siguiente: "qI" }, defecto: { error: true } },
  qI: { "N": { escribir: "N", mover: "R", siguiente: "qIN" }, defecto: { error: true } },
  qIN:{ "V": { escribir: "V", mover: "R", siguiente: "qINV"}, defecto: { error: true } },
  qINV:{ "-": { escribir: "-", mover: "R", siguiente: "qINVdash" }, defecto: { error: true } },

  // Después del guion, deben venir dígitos
  qINVdash: {
    digito: { escribir: "igual", mover: "R", siguiente: "qNum" },
    defecto: { error: true }
  },

  // Estado que consume dígitos
  qNum: {
    digito: { escribir: "igual", mover: "R", siguiente: "qNum" },
    [BLANCO]: { escribir: BLANCO, mover: "R", siguiente: "qAccept" },
    defecto: { error: true }
  },

  qAccept: {}, qReject: {}
};

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
  return { escribir: simb, mover: "R", siguiente: "qReject" };
}

// Paso
function paso() {
  if (detenido) return;
  if (estado === "qAccept" || estado === "qReject") {
    detenido = true;
    aceptado = (estado === "qAccept");
    document.getElementById("resultLabel").textContent = aceptado ? "Cadena aceptada" : "Cadena rechazada";
    return;
  }
  const simboloActual = cinta[cabezal] ?? BLANCO;
  const res = funcionTransicion(estado, simboloActual);
  if (cinta[cabezal] !== undefined) cinta[cabezal] = res.escribir;
  if (res.mover === "R") cabezal++;
  estado = res.siguiente;
  document.getElementById("stateLabel").textContent = estado;
  dibujarCinta();
}

// Dibujar cinta
function dibujarCinta() {
  const box = document.getElementById("tapeBox");
  box.innerHTML = "";
  cinta.forEach((s, i) => {
    const span = document.createElement("span");
    span.className = "tape-symbol" + (i === cabezal ? " pointer" : "");
    span.textContent = s;
    box.appendChild(span);
  });
}

// Cargar cinta
function cargarCinta() {
  const texto = (document.getElementById("inputTape").value || "").trim();
  if (!texto.endsWith("_")) {
    document.getElementById("resultLabel").textContent = "La cadena debe terminar en _";
    return;
  }
  cinta = [...texto];
  cabezal = 0;
  estado = "q0";
  detenido = false;
  aceptado = false;
  document.getElementById("resultLabel").textContent = "—";
  document.getElementById("stateLabel").textContent = estado;
  dibujarCinta();
}

// Eventos
document.getElementById("loadBtn").addEventListener("click", cargarCinta);
document.getElementById("stepBtn").addEventListener("click", paso);
document.getElementById("autoBtn").addEventListener("click", () => { while(!detenido) paso(); });
document.getElementById("resetBtn").addEventListener("click", () => { cinta=["_"]; cabezal=0; estado="q0"; detenido=false; aceptado=false; dibujarCinta(); });

// Inicio
dibujarCinta();


