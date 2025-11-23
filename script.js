// Simulador de MT que emula AFD para Regex INV-[0-9]+
// Cabezal: solo derecha; Escritura: identidad

let tape = [];      // Cinta
let head = 0;       // Cabezal
let state = "q0";   // Estado
let halted = false; // Detenido
let accept = false; // Aceptación

const elTapeContainer = document.getElementById("tapeContainer");
const elHeadIndicator = document.getElementById("headIndicator");
const elCurrentState = document.getElementById("currentState");
const elHeadPos = document.getElementById("headPos");
const elResultMsg = document.getElementById("resultMsg");
const elLogArea = document.getElementById("logArea");
const elInputTape = document.getElementById("inputTape");
const btnLoad = document.getElementById("btnLoad");
const btnStep = document.getElementById("btnStep");
const btnRun = document.getElementById("btnRun");
const btnReset = document.getElementById("btnReset");

const DIGITS = new Set(["0","1","2","3","4","5","6","7","8","9"]);
const BLANK = "_";
const isDigit = ch => DIGITS.has(ch);

const rules = {
  q0: { "I": { write: "I", move: "R", next: "qI" }, default: { toError: true } },
  qI: { "N": { write: "N", move: "R", next: "qIN" }, default: { toError: true } },
  qIN:{ "V": { write: "V", move: "R", next: "qINV"}, default: { toError: true } },
  qINV:{ "-": { write: "-", move: "R", next: "qINVdash" }, default: { toError: true } },
  qINVdash: {
    digit: { write: "same", move: "R", next: "qA" },
    [BLANK]: { write: BLANK, move: "R", next: "qReject" },
    default: { toError: true }
  },
  qA: {
    digit: { write: "same", move: "R", next: "qA" },
    [BLANK]: { write: BLANK, move: "R", next: "qAccept" },
    default: { toError: true }
  },
  qE: {
    [BLANK]: { write: BLANK, move: "R", next: "qReject" },
    default: { stayError: true }
  },
  qAccept: {}, qReject: {}
};

function renderTape() {
  elTapeContainer.innerHTML = "";
  tape.forEach((sym, idx) => {
    const cell = document.createElement("div");
    cell.className = "tape-cell" + (idx === head ? " active" : "");
    cell.textContent = sym;
    elTapeContainer.appendChild(cell);
  });
  const activeCell = elTapeContainer.children[head];
  if (activeCell) {
    elHeadIndicator.style.left = `${activeCell.offsetLeft + 10}px`;
    elHeadIndicator.style.top = `${elTapeContainer.offsetTop - 8}px`;
  }
  elCurrentState.textContent = state;
  elHeadPos.textContent = String(head);
}

function log(msg) {
  elLogArea.textContent += msg + "\n";
  elLogArea.scrollTop = elLogArea.scrollHeight;
}

function setResult(message, type = "") {
  elResultMsg.className = type ? (type === "ok" ? "ok" : type === "err" ? "err" : "warn") : "";
  elResultMsg.textContent = message;
}

function transitionFunction(currentState, currentSymbol) {
  const table = rules[currentState];
  if (!table) return { write: currentSymbol, move: "R", next: "qReject" };
  if (isDigit(currentSymbol) && table["digit"]) {
    const rule = table["digit"];
    return { write: currentSymbol, move: rule.move, next: rule.next };
  }
  if (table.hasOwnProperty(currentSymbol)) {
    const rule = table[currentSymbol];
    return { write: rule.write === "same" ? currentSymbol : rule.write, move: rule.move, next: rule.next };
  }
  if (table.default && (table.default.toError || table.default.stayError)) {
    return { write: currentSymbol, move: "R", next: "qE" };
  }
  return { write: currentSymbol, move: "R", next: "qE" };
}

function step() {
  if (halted) return;
  const currentSymbol = tape[head] ?? BLANK;
  const res = transitionFunction(state, currentSymbol);

  if (state === "qAccept" || state === "qReject") {
    halted = true;
    accept = (state === "qAccept");
    setResult(accept ? "Cadena aceptada" : "Cadena rechazada", accept ? "ok" : "err");
    return;
  }

  const prevState = state, prevHead = head, prevSymbol = currentSymbol;

  if (tape[head] !== undefined) tape[head] = res.write;

  if (res.move === "R") {
    head += 1;
    if (head >= tape.length) tape.push(BLANK);
  }

  state = res.next;

  log(`(${prevState}, '${prevSymbol}', pos=${prevHead}) -> (${state}, move=${res.move})`);
  renderTape();

  if (state === "qAccept" || state === "qReject") {
    halted = true;
    accept = (state === "qAccept");
    setResult(accept ? "Cadena aceptada" : "Cadena rechazada", accept ? "ok" : "err");
  }
}

function run() {
  let safety = 500;
  while (!halted && safety-- > 0) step();
  if (!halted) { halted = true; setResult("Ejecución detenida por seguridad", "warn"); }
}

function reset() {
  tape = [BLANK]; head = 0; state = "q0"; halted = false; accept = false;
  elLogArea.textContent = ""; setResult("—"); renderTape();
}

function loadTapeFromInput() {
  const raw = (elInputTape.value || "").trim();
  const allowed = /[INV\-0-9]/;
  const invalid = [...raw].some(ch => !allowed.test(ch));
  if (invalid) setResult("Entrada no válida", "err");
  tape = [...raw, BLANK];
  head = 0; state = "q0"; halted = false; accept = false;
  elLogArea.textContent = ""; renderTape();
}

btnLoad.addEventListener("click", loadTapeFromInput);
btnStep.addEventListener("click", step);
btnRun.addEventListener("click", run);
btnReset.addEventListener("click", reset);

reset();
