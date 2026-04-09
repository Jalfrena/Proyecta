import { GLOSSARY_ENTRIES } from "./glossary-data.js";

const dl = document.getElementById("glossary-dl");
if (dl) {
  for (const { term, description } of GLOSSARY_ENTRIES) {
    const dt = document.createElement("dt");
    dt.textContent = term;
    const dd = document.createElement("dd");
    dd.innerHTML = description;
    dl.appendChild(dt);
    dl.appendChild(dd);
  }
}
