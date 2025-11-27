let tape = [];
let head = 0;
let currentState = "q0";

const tapeBox = document.getElementById("tapeBox");
const stateLabel = document.getElementById("stateLabel");
const resultLabel = document.getElementById("resultLabel");

document.getElementById("formCinta").addEventListener("submit", function (e) {
  e.preventDefault();
  const input = document.getElementById("inputTape").value.trim();
  const regex = /^INV-\d+$/;

  if (!regex.test(input)) {
    alert("Formato inválido. Debe comenzar con 'INV-' seguido de uno o más dígitos.");
    return;
  }

  tape = input.split("");
  head = 0;
  currentState = "q0";
  resultLabel.textContent = "—";
  renderTape();
  stateLabel.textContent = "Cinta cargada, estado inicial q0";
});

function renderTape() {
  tapeBox.innerHTML = "";
  tape.forEach((symbol, index) => {
    const cell = document.createElement("span");
    cell.className = "tape-cell" + (index === head ? " active" : "");
    cell.textContent = symbol;
    tapeBox.appendChild(cell);
  });
}

document.getElementById("stepBtn").addEventListener("click", step);

function step() {
  if (tape.length === 0) return;

  const symbol = tape[head];
  let estadoAnterior = currentState;

  switch (currentState) {
    case "q0":
      if (symbol === "I") {
        logProceso(estadoAnterior, symbol, "Reconoce inicio 'I'", "Derecha", "q1", "Inicio del prefijo INV");
        head++;
        currentState = "q1";
      } else {
        reject("Esperaba 'I'");
      }
      break;

    case "q1":
      if (symbol === "N") {
        logProceso(estadoAnterior, symbol, "Reconoce 'N'", "Derecha", "q2", "Segundo símbolo del prefijo INV");
        head++;
        currentState = "q2";
      } else {
        reject("Esperaba 'N'");
      }
      break;

    case "q2":
      if (symbol === "V") {
        logProceso(estadoAnterior, symbol, "Reconoce 'V'", "Derecha", "q3", "Completa el prefijo INV");
        head++;
        currentState = "q3";
      } else {
        reject("Esperaba 'V'");
      }
      break;

    case "q3":
      if (symbol === "-") {
        logProceso(estadoAnterior, symbol, "Reconoce '-'", "Derecha", "qDigits", "Separador antes de los dígitos");
        head++;
        currentState = "qDigits";
      } else {
        reject("Esperaba '-'");
      }
      break;

    case "qDigits":
      if (/[0-9]/.test(symbol)) {
        logProceso(estadoAnterior, symbol, "Reconoce dígito", "Derecha", "qDigits", "Parte numérica del código");
        head++;
        if (head >= tape.length) {
          accept();
        }
      } else {
        reject("Esperaba dígito");
      }
      break;
  }

  renderTape();
}

function logProceso(estadoAnterior, leido, accion, movimiento, nuevoEstado, explicacion) {
  stateLabel.innerHTML = `
    <div class="log-item">Estado anterior: <strong>${estadoAnterior}</strong></div>
    <div class="log-item">Símbolo leído: <strong>${leido}</strong></div>
    <div class="log-item">Acción: <strong>${accion}</strong></div>
    <div class="log-item">Movimiento del cabezal: <strong>${movimiento}</strong></div>
    <div class="log-item">Nuevo estado: <strong>${nuevoEstado}</strong></div>
    <div class="log-item text-muted">Explicación: ${explicacion}</div>
  `;
}

document.getElementById("autoBtn").addEventListener("click", function () {
  while (currentState !== "qAccept" && currentState !== "qReject") {
    step();
  }
});

document.getElementById("resetBtn").addEventListener("click", function () {
  tape = [];
  head = 0;
  currentState = "q0";
  tapeBox.innerHTML = "<span class='text-muted'>Cinta vacía</span>";
  stateLabel.textContent = "—";
  resultLabel.textContent = "—";
});

function accept() {
  currentState = "qAccept";
  stateLabel.innerHTML = "<div class='log-item'><strong>Cadena aceptada</strong> → El código cumple la gramática INV-[0-9]+</div>";
  resultLabel.textContent = "Código válido ✅";
}

function reject(reason) {
  currentState = "qReject";
  stateLabel.innerHTML = `<div class='log-item'><strong>Error:</strong> ${reason} → No cumple la gramática INV-[0-9]+</div>`;
  resultLabel.textContent = "Código inválido ❌";
}


