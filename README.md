# Simulador de Máquina de Turing que emula un AFD — Regex: `INV-[0-9]+`

## Problema y Regex elegido
**Regex:** `INV-[0-9]+`  
Valida códigos de inventario con prefijo fijo `INV-` seguido de uno o más dígitos.  
Es un lenguaje regular porque combina un prefijo fijo con una clausura de Kleene sobre el conjunto de dígitos.

---

## AFD (Diseño)

- **Estados (Q):** { q0, qI, qIN, qINV, qINVdash, qA, qE }  
- **Alfabeto (Σ):** { I, N, V, -, 0,1,2,3,4,5,6,7,8,9 }  
- **Estado inicial:** q0  
- **Estado(s) de aceptación (F):** qA  
- **Estado de error/trampa:** qE  

### Transiciones
- q0 —I→ qI  
- qI —N→ qIN  
- qIN —V→ qINV  
- qINV —-→ qINVdash  
- qINVdash —dígito→ qA  
- qA —dígito→ qA  
- qA —_ (blanco) → aceptar  
- Cualquier símbolo inesperado → qE  

---

## MT restringida (emulación del AFD)

- **Movimiento:** Solo a la derecha.  
- **Escritura:** Identidad (no cambia símbolos).  
- **Blanco `_`:** Fin de cinta para decidir aceptar/rechazar.  
- **Estados terminales:** qAccept, qReject.  

### Tabla de transición (extracto)
| Estado | Símbolo leído | Nuevo estado | Movimiento |
|--------|---------------|--------------|------------|
| q0     | I             | qI           | R |
| qI     | N             | qIN          | R |
| qIN    | V             | qINV         | R |
| qINV   | -             | qINVdash     | R |
| qINVdash | dígito      | qA           | R |
| qINVdash | _           | qReject      | R |
| qA     | dígito        | qA           | R |
| qA     | _             | qAccept      | R |

---

## Mapeo teoría → código

- **Cinta:** `tape[]` (UI en `.tape-box`).  
- **Cabezal:** `head` (posición activa en la cinta).  
- **Estado actual:** `currentState` (UI en `#historyLog`).  
- **Tabla de reglas:** objeto de transiciones en `script.js`.  
- **Motor:** funciones `step()` (paso a paso) y ejecución automática con `autoBtn`.

---

## URL del simulador (GitHub Pages)

👉 [Simulador en vivo](https://juanjoseql7.github.io/mt-simulador-afd-inv/)

---

## Casos de prueba

- ✅ **Acepta:**  
  - `INV-0`  
  - `INV-12345`  

- ❌ **Rechaza por incompleta:**  
  - `INV-`  

- ❌ **Rechaza por símbolo inválido:**  
  - `INV-A1`  
  - `INX-12`  

---

## Integrantes
- **Juan José Quintero López** — Regex elegido: `INV-[0-9]+`
