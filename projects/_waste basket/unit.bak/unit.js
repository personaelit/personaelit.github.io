import { Unit, PageSpecificUnit, updateUnit } from './dataModel.js';
import { saveToLocalStorage, loadFromLocalStorage } from './storage.js';

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("unitForm");
  const output = document.getElementById("output");

  let units = loadFromLocalStorage();

  if (units.length > 0) {
    output.textContent = `Loaded from localStorage: ${JSON.stringify(units, null, 2)}`;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const pageProperty = formData.get("pageProperty");
    const newUnit = new PageSpecificUnit(pageProperty);

    units.push(newUnit);
    saveToLocalStorage(units);

    output.textContent = `Created and saved to localStorage: ${JSON.stringify(newUnit, null, 2)}`;
  });
});
