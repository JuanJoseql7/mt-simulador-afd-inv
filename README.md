# Simulador de Máquina de Turing que emula un AFD — Regex: `INV-[0-9]+`

## 📌 Problema y Regex elegido
**Regex:** `INV-[0-9]+`  

Este patrón valida códigos de inventario con:
- Prefijo fijo `INV-`
- Seguido de **uno o más dígitos** (`[0-9]+`)

Es un **lenguaje regular**, porque combina un prefijo fijo con una clausura de Kleene sobre el conjunto de dígitos.

---

## 🧩 AFD (Diseño)

- **Estados (Q):** { q0, qI, qIN, qINV, qINVdash, qA, qE }  
- **Alfabeto (Σ):** { I, N, V, -, 0,1,2,3,4,5,6,7,8,9 }  
- **Estado inicial:** q0  
- **Estado(s) de aceptación (F):** qA  
- **Estado de error/trampa:** qE  

### Descripción de transiciones
- q0 —I→ qI  
- qI —N→ qIN  
- qIN —V→ qINV  
- qINV —-→ qINVdash  
- qINVdash —dígito→ qA  
- qA —dígito→ qA (bucle)  
- qA —_ (blanco) → aceptar  
- Cualquier símbolo inesperado → qE (trampa)

---

## ⚙️ MT restringida (emulación del AFD)

- **Movimiento:** Solo a la derecha.  
- **Escritura:** Identidad (no cambia símbolos).  
- **Blanco `_`:** Fin de cinta para decidir aceptar/rechazar.  
- **Estados terminales:** qAccept, qReject.  

---

## 📊 Tabla de transición completa

| Estado actual | Símbolo leído | Nuevo estado | Movimiento | Acción / Explicación |
|---------------|---------------|--------------|------------|----------------------|
| q0            | I             | qI           | R          | Reconoce inicio `I` |
| qI            | N             | qIN          | R          | Reconoce `N` |
| qIN           | V             | qINV         | R          | Reconoce `V` |
| qINV          | -             | qINVdash     | R          | Reconoce guion `-` |
| qINVdash      | dígito        | qA           | R          | Primer dígito válido |
| qINVdash      | _             | qReject      | R          | No hay dígitos → error |
| qA            | dígito        | qA           | R          | Bucle sobre dígitos |
| qA            | _             | qAccept      | R          | Fin de cinta → aceptar |
| *             | cualquier otro| qE           | R          | Símbolo inválido |

---

## 🔗 Mapeo teoría → código

- **Cinta:** `tape[]` (UI en `.tape-box`)  
- **Cabezal:** `head` (posición activa en la cinta)  
- **Estado actual:** `currentState` (UI en `#historyLog`)  
- **Tabla de reglas:** objeto de transiciones en `script.js`  
- **Motor:** funciones `step()` (paso a paso) y ejecución automática con `autoBtn`  

---

## 🌐 URL del simulador (GitHub Pages)

👉 [Simulador en vivo](https://juanjoseql7.github.io/mt-simulador-afd-inv/)

---

## 🧪 Casos de prueba

- ✅ **Acepta:**  
  - `INV-0`  
  - `INV-12345`  

- ❌ **Rechaza por incompleta:**  
  - `INV-`  

- ❌ **Rechaza por símbolo inválido:**  
  - `INV-A1`  
  - `INX-12`  

---

## 👥 Integrantes
- **Juan José Quintero López** — Regex elegido: `INV-[0-9]+`
