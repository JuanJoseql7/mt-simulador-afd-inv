# Simulador de Máquina de Turing (Emulación AFD) — INV-[0-9]+

## Regex elegido
INV-[0-9]+

## AFD (resumen)
q0 --I--> qI --N--> qIN --V--> qINV ----> qINVdash  
qINVdash --digit--> qA --digit--> qA  
En qA al leer _ → aceptar; cualquier símbolo inesperado → error.

## Mapeo teoría → código
- Cinta: tape[]
- Cabezal: head
- Estado: state
- Reglas: rules en script.js
- Motor: step()
