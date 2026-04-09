/**
 * Definiciones del glosario (solo contenido; la vista está en glosario.html).
 * `description` puede incluir HTML seguro (strong, em, code).
 * @type {{ term: string, description: string }[]}
 */
export const GLOSSARY_ENTRIES = [
  {
    term: "Interés compuesto",
    description:
      "Cada año la tasa se aplica sobre lo ya acumulado, no solo sobre V₀. Por eso el crecimiento puede acelerarse con el tiempo (curvas del gráfico).",
  },
  {
    term: "V₀ (capital inicial)",
    description: "Monto desde el que partes al año 0.",
  },
  {
    term: "r (tasa anual, %)",
    description:
      "Porcentaje que asumes <strong>cada año</strong> sobre el saldo al inicio de ese año. Puedes usar decimales.",
  },
  {
    term: "t (años)",
    description:
      "Horizonte de la simulación. Si escribes decimales, la app usa el <strong>entero redondeado</strong> más cercano (entre 1 y 50) para la tabla año a año.",
  },
  {
    term: "Valor final V(t) — escenario realista",
    description: "Saldo al cierre del último año usando exactamente tu tasa <strong>r</strong>.",
  },
  {
    term: "Escenario optimista",
    description: "Misma lógica que el realista con tasa <strong>r + 5 puntos porcentuales</strong>.",
  },
  {
    term: "Escenario realista",
    description: "Usa tu <strong>r</strong>. Es el que alimenta la tabla y varios indicadores.",
  },
  {
    term: "Escenario pesimista",
    description: "Usa <strong>r − 5 puntos</strong>, sin bajar de 0%.",
  },
  {
    term: "Curvas del gráfico (exponencial)",
    description:
      "Tres líneas: saldo año a año con interés compuesto en optimista, realista y pesimista.",
  },
  {
    term: "Línea lineal (referencia)",
    description:
      "Recta de comparación: V₀ + V₀·(r/100)·año con tu <strong>r</strong> realista. Solo sirve para contrastar con el crecimiento exponencial; no es un modelo alternativo completo.",
  },
  {
    term: "ROI total",
    description:
      "<em>Return on investment:</em> ((valor final − V₀) / V₀) × 100, en el escenario realista.",
  },
  {
    term: "Break-even",
    description:
      "Primer año en que la <strong>ganancia acumulada</strong> (saldo − V₀) supera V₀. Si no ocurre dentro de los <strong>t</strong> años simulados, el indicador indica que el hito queda fuera de ese periodo.",
  },
  {
    term: "Modo de estrés",
    description:
      "A partir de la segunda mitad del horizonte (según el entero <strong>t</strong>), la tasa efectiva baja <strong>2 puntos porcentuales</strong> en los tres escenarios (mínimo 0%).",
  },
  {
    term: "Punto porcentual",
    description:
      "Diferencia entre dos tasas en “puntos”: de 10% a 8% son 2 puntos porcentuales (no lo mismo que restar un 2% al capital).",
  },
  {
    term: "Tabla año a año",
    description:
      "Escenario realista: por cada año, capital al inicio, interés de ese año y capital acumulado al cierre. Se calcula paso a paso para poder aplicar el modo de estrés.",
  },
  {
    term: "Presets",
    description: "Botones que cargan ejemplos de V₀, r y t.",
  },
  {
    term: "Chart.js",
    description:
      "Librería que dibuja el gráfico; en este proyecto va en archivos locales (<code>vendor/</code>).",
  },
];
