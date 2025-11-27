// Variables globales
let tape = [];
let head = 0;
let currentState = "q0";

// Referencias DOM
const tapeBox = document.getElementById("tapeBox");
const stateLabel = document.getElementById("stateLabel");
const resultLabel = document.getElementById("resultLabel");

// Cargar cinta desde input
document.getElementById("formCinta").addEventListener("submit", function(e) {
    e.preventDefault();
    const input = document.getElementById("inputTape").value.trim();

    // Regex: INV- seguido de dígitos
    const regex = /^INV-\d+$/;
    if (!regex.test(input)) {
        alert("Formato inválido. Debe ser INV- seguido de dígitos.");
        return;
    }

    tape = input.split("");
    head = 0;
    currentState = "q0";
    resultLabel.textContent = "—";
    renderTape();
    stateLabel.textContent = "Cinta cargada, estado inicial q0";
});

// Renderizar cinta
function renderTape() {
    tapeBox.innerHTML = "";
    tape.forEach((symbol, index) => {
        const cell = document.createElement("span");
        cell.className = "tape-cell" + (index === head ? " active" : "");
        cell.textContent = symbol;
        tapeBox.appendChild(cell);
    });
}

// Avanzar un paso
document.getElementById("stepBtn").addEventListener("click", step);

function step() {
    if (tape.length === 0) return;

    const symbol = tape[head];

    switch (currentState) {
        case "q0":
            if (symbol === "I") {
                stateLabel.textContent = "Leyendo 'I' → mover derecha";
                head++;
                currentState = "q1";
            } else {
                reject("Esperaba 'I'");
            }
            break;

        case "q1":
            if (symbol === "N") {
                stateLabel.textContent = "Leyendo 'N' → mover derecha";
                head++;
                currentState = "q2";
            } else {
                reject("Esperaba 'N'");
            }
            break;

        case "q2":
            if (symbol === "V") {
                stateLabel.textContent = "Leyendo 'V' → mover derecha";
                head++;
                currentState = "q3";
            } else {
                reject("Esperaba 'V'");
            }
            break;

        case "q3":
            if (symbol === "-") {
                stateLabel.textContent = "Leyendo '-' → mover derecha";
                head++;
                currentState = "qDigits";
            } else {
                reject("Esperaba '-'");
            }
            break;

        case "qDigits":
            if (/[0-9]/.test(symbol)) {
                stateLabel.textContent = `Leyendo dígito '${symbol}' → mover derecha`;
                head++;
                if (head >= tape.length) {
                    accept();
                }
            } else {
                reject("Esperaba dígito");
            }
            break;

        case "qAccept":
        case "qReject":
            stateLabel.textContent = "Proceso terminado";
            break;
    }

    renderTape();
}

// Ejecutar todo automáticamente
document.getElementById("autoBtn").addEventListener("click", function() {
    while (currentState !== "qAccept" && currentState !== "qReject") {
        step();
    }
});

// Reiniciar
document.getElementById("resetBtn").addEventListener("click", function() {
    tape = [];
    head = 0;
    currentState = "q0";
    tapeBox.innerHTML = "<span class='text-muted'>Cinta vacía</span>";
    stateLabel.textContent = "—";
    resultLabel.textContent = "—";
});

// Funciones de aceptación y rechazo
function accept() {
    currentState = "qAccept";
    stateLabel.textContent = "Cadena aceptada";
    resultLabel.textContent = "Código válido ✅";
}

function reject(reason) {
    currentState = "qReject";
    stateLabel.textContent = `Error: ${reason}`;
    resultLabel.textContent = "Código inválido ❌";
}


