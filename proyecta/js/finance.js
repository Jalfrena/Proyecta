/**
 * Proyecta: Analysis & Growth — lógica financiera (interés compuesto año a año).
 * @module finance
 */

/** @typedef {number} Monetary Monto en unidades monetarias (sin símbolo). */
/** @typedef {number} PercentAnnual Tasa anual en porcentaje (ej. 10 = 10%). */

/**
 * @param {PercentAnnual} pct
 * @returns {PercentAnnual}
 */
export function clampRateNonNegative(pct) {
  return Math.max(0, pct);
}

/**
 * Serie año a año sin fórmula cerrada (permite shocks).
 * @param {Monetary} v0
 * @param {PercentAnnual} rateAnnualPct
 * @param {number} years Entero >= 0
 * @param {{ active: boolean, dropPercentagePoints?: number }} stress
 * @returns {{ year: number, capitalInicial: Monetary, interesGanado: Monetary, capitalAcumulado: Monetary }[]}
 */
export function buildYearlyTable(v0, rateAnnualPct, years, stress) {
  const drop = stress.dropPercentagePoints ?? 2;
  const mid = Math.floor(years / 2);
  /** @type {{ year: number, capitalInicial: Monetary, interesGanado: Monetary, capitalAcumulado: Monetary }[]} */
  const rows = [];
  let balance = v0;

  rows.push({
    year: 0,
    capitalInicial: v0,
    interesGanado: 0,
    capitalAcumulado: v0,
  });

  for (let y = 1; y <= years; y += 1) {
    const capitalInicial = balance;
    let r = rateAnnualPct;
    if (stress.active && y > mid) {
      r = clampRateNonNegative(r - drop);
    }
    const interesGanado = capitalInicial * (r / 100);
    const capitalAcumulado = capitalInicial + interesGanado;
    balance = capitalAcumulado;
    rows.push({
      year: y,
      capitalInicial,
      interesGanado,
      capitalAcumulado,
    });
  }

  return rows;
}

/**
 * @param {Monetary} v0
 * @param {PercentAnnual} baseRatePct
 * @returns {{ optimista: PercentAnnual, realista: PercentAnnual, pesimista: PercentAnnual }}
 */
export function scenarioRates(baseRatePct) {
  return {
    optimista: baseRatePct + 5,
    realista: baseRatePct,
    pesimista: clampRateNonNegative(baseRatePct - 5),
  };
}

/**
 * ROI total: ((V_t - V_0) / V_0) * 100
 * @param {Monetary} v0
 * @param {Monetary} finalValue
 * @returns {number}
 */
export function roiTotalPercent(v0, finalValue) {
  if (v0 <= 0) return 0;
  return ((finalValue - v0) / v0) * 100;
}

/**
 * Primer año en que los intereses acumulados superan V_0 (balance - V0 > V0).
 * @param {ReturnType<typeof buildYearlyTable>} rows
 * @param {Monetary} v0
 * @returns {number | null} Año (entero) o null si no ocurre en el horizonte
 */
export function breakEvenYear(rows, v0) {
  if (v0 <= 0) return null;
  for (const row of rows) {
    if (row.year === 0) continue;
    const interesesAcumulados = row.capitalAcumulado - v0;
    if (interesesAcumulados > v0) return row.year;
  }
  return null;
}

/**
 * Valores por año para gráfico (solo balance al cierre).
 * @param {ReturnType<typeof buildYearlyTable>} rows
 * @returns {number[]}
 */
export function balancesFromRows(rows) {
  return rows.map((r) => r.capitalAcumulado);
}

/**
 * Referencia lineal simple: V0 + V0 * (r/100) * año
 * @param {Monetary} v0
 * @param {PercentAnnual} rateAnnualPct
 * @param {number} years
 * @returns {number[]}
 */
export function linearReferenceSeries(v0, rateAnnualPct, years) {
  const out = [];
  for (let y = 0; y <= years; y += 1) {
    out.push(v0 + v0 * (rateAnnualPct / 100) * y);
  }
  return out;
}
