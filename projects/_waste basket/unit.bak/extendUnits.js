import { updateUnit } from './dataModel.js';
import { saveToLocalStorage, loadFromLocalStorage } from './storage.js';

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("extendUnitForm");
  const unitIdSelect = document.getElementById("unitId");
  const output = document.getElementById("output");

  let units = loadFromLocalStorage();

  // Populate the dropdown with existing unit IDs
  units.forEach(unit => {
    const option = document.createElement("option");
    option.value = unit.id;
    option.text = unit.id;
    unitIdSelect.appendChild(option);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const unitId = unitIdSelect.value;
    const unitName = document.getElementById("unitName").value;

    // Find the unit by ID and extend it
    const unitToExtend = units.find(unit => unit.id === unitId);
    if (unitToExtend) {
      const extendedUnit = updateUnit(unitToExtend, { name: unitName });
      
      // Replace the old unit with the extended unit
      units = units.map(unit => unit.id === unitId ? extendedUnit : unit);
      saveToLocalStorage(units);

      output.textContent = `Extended and saved to localStorage: ${JSON.stringify(extendedUnit, null, 2)}`;
    } else {
      output.textContent = "Unit not found.";
    }
  });
});
