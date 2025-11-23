# Simulador de Máquina de Turing que emula un AFD — Regex: INV-[0-9]+

## Problema y Regex elegido
**Regex:** `INV-[0-9]+`  
Valida códigos de inventario con prefijo fijo `INV-` seguido de uno o más dígitos. Es un lenguaje regular (prefijo + cierre de Kleene).

## AFD (diseño)
- **Estados (Q):** `q0, qI, qIN, qINV, qINVdash, qA, qE`
- **Alfabeto (Σ):** `{ I, N, V, -, 0,1,2,3,4,5,6,7,8,9 }`
- **Inicial:** `q0`
- **Final(es) (F):** `qA`

### Descripción de transiciones
q0 —I→ qI —N→ qIN —V→ qINV —-→ qINVdash  
qINVdash —dígito→ qA —dígito→ qA  
En `qA`, al leer `_` (blanco) → aceptar.  
Cualquier símbolo inesperado → `qE` (trampa).

## MT restringida (emulación del AFD)
- **Movimiento:** Solo a la derecha.
- **Escritura:** Identidad (no cambia símbolos).
- **Blanco `_`:** Fin de cinta para decidir aceptar/rechazar.
- **Estados terminales:** `qAccept`, `qReject`.

### Tabla de transición (extracto)
- (q0, I) → (qI, R)
- (qI, N) → (qIN, R)
- (qIN, V) → (qINV, R)
- (qINV, -) → (qINVdash, R)
- (qINVdash, dígito) → (qA, R)
- (qINVdash, _) → (qReject, R)
- (qA, dígito) → (qA, R)
- (qA, _) → (qAccept, R)

## Mapeo teoría → código
- **Cinta:** `tape[]` (UI en `.tape-container`).
- **Cabezal:** `head` (indicador `#headIndicator`).
- **Estado actual:** `state` (UI `#currentState`).
- **Tabla de reglas:** Objeto `rules` en `script.js`.
- **Motor:** `step()` (paso a paso) y `run()` (automático).

## URL del simulador (GitHub Pages)
https://juanjoseql7.github.io/mt-simulador-afd-inv/

## Casos de prueba
- Acepta: `INV-0`, `INV-12345`
- Rechaza por incompleta: `INV-`
- Rechaza por símbolo inválido: `INV-A1`, `INX-12`

## Integrantes
- Juan Jose Quintero Lopez
