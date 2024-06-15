function saveToLocalStorage(units) {
    localStorage.setItem('units', JSON.stringify(units));
  }
  
  function loadFromLocalStorage() {
    return JSON.parse(localStorage.getItem('units')) || [];
  }
  
  export { saveToLocalStorage, loadFromLocalStorage };
  