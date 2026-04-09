import {
  buildYearlyTable,
  scenarioRates,
  roiTotalPercent,
  breakEvenYear,
  balancesFromRows,
  linearReferenceSeries,
} from "./finance.js";

/** @type {any} */
let chart = null;

const els = {
  v0: /** @type {HTMLInputElement} */ (document.getElementById("v0")),
  rateInput: /** @type {HTMLInputElement} */ (document.getElementById("rate-input")),
  yearsInput: /** @type {HTMLInputElement} */ (document.getElementById("years-input")),
  rateSlider: /** @type {HTMLInputElement} */ (document.getElementById("rate-slider")),
  yearsSlider: /** @type {HTMLInputElement} */ (document.getElementById("years-slider")),
  rateSliderWrap: document.getElementById("rate-slider-wrap"),
  yearsSliderWrap: document.getElementById("years-slider-wrap"),
  useSliders: /** @type {HTMLInputElement} */ (document.getElementById("use-sliders")),
  stress: /** @type {HTMLInputElement} */ (document.getElementById("stress")),
  v0Display: document.getElementById("v0-display"),
  kpiRoi: document.getElementById("kpi-roi"),
  kpiBreakEven: document.getElementById("kpi-breakeven"),
  kpiFinal: document.getElementById("kpi-final"),
  alertBox: document.getElementById("alert-box"),
  tableBody: document.getElementById("table-body"),
  canvas: /** @type {HTMLCanvasElement} */ (document.getElementById("mainChart")),
};

/**
 * @param {number} n
 * @param {number} lo
 * @param {number} hi
 */
function clamp(n, lo, hi) {
  return Math.min(hi, Math.max(lo, n));
}

function readRate() {
  const raw = parseFloat(els.rateInput.value);
  if (Number.isNaN(raw)) return 0;
  return clamp(raw, 0, 100);
}

function readYearsInt() {
  const raw = parseFloat(els.yearsInput.value);
  if (Number.isNaN(raw)) return 1;
  return clamp(Math.round(raw), 1, 50);
}

/**
 * @param {number} n
 * @returns {string}
 */
function fmtMoney(n) {
  return (
    "$" +
    n.toLocaleString("es-SV", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  );
}

function readInputs() {
  const v0 = Math.max(0, parseFloat(els.v0.value) || 0);
  const rate = readRate();
  const years = readYearsInt();
  const stressActive = els.stress.checked;
  return { v0, rate, years, stressActive };
}

function updateReadouts() {
  const { v0 } = readInputs();
  els.v0Display.textContent = fmtMoney(v0);
}

function syncSlidersFromInputs() {
  const rate = readRate();
  const years = readYearsInt();
  els.rateSlider.value = String(rate);
  els.yearsSlider.value = String(years);
  els.rateSlider.setAttribute("aria-valuenow", String(rate));
  els.yearsSlider.setAttribute("aria-valuenow", String(years));
}

function slidersVisible() {
  return els.useSliders.checked;
}

function setSliderVisibility(show) {
  els.rateSliderWrap.hidden = !show;
  els.yearsSliderWrap.hidden = !show;
}

function onUseSlidersChange() {
  const show = slidersVisible();
  setSliderVisibility(show);
  if (show) syncSlidersFromInputs();
  run();
}

function renderAlert(rate) {
  const box = els.alertBox;
  const criticalMsg =
    "Riesgo de Supuesto Irrealista: Los crecimientos exponenciales agresivos son difícilmente sostenibles a largo plazo.";
  if (rate > 50) {
    box.className = "alert show danger";
    box.innerHTML = `<strong>Alerta:</strong> ${criticalMsg}`;
    return;
  }
  if (rate > 25) {
    box.className = "alert show";
    box.innerHTML = `<strong>Nota:</strong> Una tasa del <strong>${rate}%</strong> es muy ambiciosa. Documenta el supuesto con datos de mercado.`;
    return;
  }
  box.className = "alert";
  box.innerHTML = "";
}

function renderTable(rows) {
  const tb = els.tableBody;
  tb.innerHTML = "";
  rows.forEach((row, idx) => {
    const tr = document.createElement("tr");
    if (idx === rows.length - 1) tr.className = "highlight-row";
    const isZero = row.year === 0;
    tr.innerHTML = `
      <td>Año ${row.year}</td>
      <td class="${isZero ? "" : "positive"}">${fmtMoney(row.capitalInicial)}</td>
      <td>${isZero ? "—" : fmtMoney(row.interesGanado)}</td>
      <td>${fmtMoney(row.capitalAcumulado)}</td>
    `;
    tb.appendChild(tr);
  });
}

function renderKpis(v0, finalReal, roi, beYear) {
  els.kpiFinal.textContent = fmtMoney(finalReal);
  els.kpiRoi.textContent = `${roi.toFixed(1)}%`;
  els.kpiBreakEven.textContent =
    beYear === null ? "N/A en el horizonte" : `Año ${beYear}`;
}

function drawChart(labels, series, linearLine) {
  const ChartCtor = window.Chart;
  if (!ChartCtor) return;

  const ctx = els.canvas.getContext("2d");
  if (!ctx) return;
  if (chart) chart.destroy();

  const grid = "rgba(42,42,63,0.55)";
  const tick = "#a1a1b5";

  chart = new ChartCtor(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Optimista (r + 5%)",
          data: series.optimista,
          borderColor: "#00e5a0",
          backgroundColor: "rgba(0,229,160,0.06)",
          borderWidth: 2.5,
          pointBackgroundColor: "#00e5a0",
          pointBorderColor: "#042",
          pointRadius: 3,
          pointHoverRadius: 6,
          fill: false,
          tension: 0.35,
        },
        {
          label: "Realista (r base)",
          data: series.realista,
          borderColor: "#f59e0b",
          backgroundColor: "rgba(245,158,11,0.08)",
          borderWidth: 2.5,
          pointBackgroundColor: "#f59e0b",
          pointBorderColor: "#3f2e00",
          pointRadius: 3,
          pointHoverRadius: 6,
          fill: false,
          tension: 0.35,
        },
        {
          label: "Pesimista (r − 5%)",
          data: series.pesimista,
          borderColor: "#c4b5fd",
          backgroundColor: "rgba(196,181,253,0.08)",
          borderWidth: 2.5,
          pointBackgroundColor: "#c4b5fd",
          pointBorderColor: "#2e1065",
          pointRadius: 3,
          pointHoverRadius: 6,
          fill: false,
          tension: 0.35,
        },
        {
          label: "Lineal (referencia, r realista)",
          data: linearLine,
          borderColor: "#9ca3af",
          borderDash: [6, 4],
          borderWidth: 1.5,
          pointRadius: 0,
          fill: false,
          tension: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: "index" },
      plugins: {
        legend: {
          labels: {
            color: tick,
            font: { family: "system-ui", size: 11 },
            boxWidth: 18,
            padding: 10,
          },
        },
        tooltip: {
          backgroundColor: "#1a1a26",
          borderColor: "#2a2a3f",
          borderWidth: 1,
          titleColor: "#e8e8f0",
          bodyColor: "#c4c4d4",
          callbacks: {
            label(ctx) {
              const y = ctx.parsed.y;
              if (y === undefined || y === null) return ` ${ctx.dataset.label}`;
              return ` ${ctx.dataset.label}: ${fmtMoney(y)}`;
            },
          },
        },
      },
      scales: {
        x: {
          ticks: { color: tick, font: { size: 11 } },
          grid: { color: grid },
        },
        y: {
          ticks: {
            color: tick,
            font: { size: 11 },
            callback(v) {
              const n = Number(v);
              if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
              if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
              return `$${n.toFixed(0)}`;
            },
          },
          grid: { color: grid },
        },
      },
    },
  });
}

function run() {
  updateReadouts();
  const { v0, rate, years, stressActive } = readInputs();
  const stress = { active: stressActive, dropPercentagePoints: 2 };
  const rates = scenarioRates(rate);

  const rowsOpt = buildYearlyTable(v0, rates.optimista, years, stress);
  const rowsReal = buildYearlyTable(v0, rates.realista, years, stress);
  const rowsPes = buildYearlyTable(v0, rates.pesimista, years, stress);

  const finalReal = rowsReal[rowsReal.length - 1]?.capitalAcumulado ?? v0;
  const roi = roiTotalPercent(v0, finalReal);
  const beYear = breakEvenYear(rowsReal, v0);

  renderKpis(v0, finalReal, roi, beYear);
  renderAlert(rate);
  renderTable(rowsReal);

  const labels = rowsReal.map((r) => `Año ${r.year}`);
  drawChart(
    labels,
    {
      optimista: balancesFromRows(rowsOpt),
      realista: balancesFromRows(rowsReal),
      pesimista: balancesFromRows(rowsPes),
    },
    linearReferenceSeries(v0, rates.realista, years)
  );
}

function wireEvents() {
  els.useSliders.addEventListener("change", onUseSlidersChange);

  els.rateSlider.addEventListener("input", () => {
    els.rateInput.value = els.rateSlider.value;
    run();
  });

  els.yearsSlider.addEventListener("input", () => {
    els.yearsInput.value = els.yearsSlider.value;
    run();
  });

  els.rateInput.addEventListener("input", () => {
    if (slidersVisible()) syncSlidersFromInputs();
    run();
  });

  els.yearsInput.addEventListener("input", () => {
    if (slidersVisible()) syncSlidersFromInputs();
    run();
  });

  [els.v0, els.stress].forEach((el) => {
    el.addEventListener("input", run);
    el.addEventListener("change", run);
  });
}

/**
 * @param {number} v0
 * @param {number} rate
 * @param {number} years
 */
window.loadPreset = function loadPreset(v0, rate, years) {
  els.v0.value = String(v0);
  els.rateInput.value = String(rate);
  els.yearsInput.value = String(years);
  if (slidersVisible()) syncSlidersFromInputs();
  run();
};

setSliderVisibility(false);
wireEvents();
run();
