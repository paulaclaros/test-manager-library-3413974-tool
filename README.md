# Manager Library — Herramienta Sembradora de Demostración (Tool)

> **Evaluación Técnica · Ficha ADSO 3413974 · SENA**  
> Sembrador de datos de demostración para *Manager Library* mediante consumo exclusivo de la API HTTP (Tarea T-21).

---

## 🎯 Objetivo de la Tarea T-21

Cumplir el requerimiento de prueba de carga y datos de demostración respetando el **Artículo IX** y la regla de datos:
* La base nunca se puebla con scripts SQL manuales.
* Toda la siembra se realiza **a través de los endpoints de la API**.
* Siembra:
  * **≥ 40 libros** repartidos en las 5 categorías fijas.
  * **10 socios** con documento único.
  * **15 préstamos** con combinaciones de 1 a 3 libros.
  * Verificación de la bandeja de vencidos y del reporte histórico (ADR-004).

---

## 🚀 Instrucciones de Ejecución

Con la API en ejecución (ya sea por Docker o desarrollo local):

```bash
# Ejecutar con Node.js (Node 18+)
node seed.js http://localhost:8080/api/v1
```
