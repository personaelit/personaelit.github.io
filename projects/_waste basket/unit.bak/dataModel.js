class Unit {
    constructor() {
      this.id = Math.random().toString(36).substr(2, 9);
      this.createdDate = new Date();
      this.lastModifiedDate = new Date();
      Object.freeze(this);
    }
  }
  
  class PageSpecificUnit extends Unit {
    constructor(pageProperty) {
      super();
      return Object.freeze({
        ...this,
        pageProperty
      });
    }
  }
  
  function updateUnit(unit, newProps) {
    const updatedUnit = Object.freeze({
      ...unit,
      ...newProps,
      lastModifiedDate: new Date()
    });
    return updatedUnit;
  }
  
  export { Unit, PageSpecificUnit, updateUnit };
  