class GlobalTags {
    constructor() {
      if (!GlobalTags.instance) {
        this.tags = new Set(JSON.parse(localStorage.getItem('globalTags') || '[]'));
        GlobalTags.instance = this;
      }
      return GlobalTags.instance;
    }
  
    save() {
      localStorage.setItem('globalTags', JSON.stringify(Array.from(this.tags)));
    }
  
    addTag(tag) {
      this.tags.add(tag);
      this.save();
    }
  
    removeTag(tag) {
      this.tags.delete(tag);
      this.save();
    }
  
    hasTag(tag) {
      return this.tags.has(tag);
    }
  }
  

  const globalTags = new GlobalTags();

  class Unit {
    constructor(id, name, status, priority, description, tags = []) {
      this.id = id;
      this.name = name;
      this.status = status;
      this.priority = priority;
      this.description = description;
      this.tags = tags;
      tags.forEach(tag => globalTags.addTag(tag));
    }
  }

// async function storeUnitInDB(unit) {
//     return new Promise((resolve, reject) => {
//         const request = indexedDB.open("UnitDB", 1);

//         request.onerror = function(event) {
//             reject("Could not open IndexedDB.");
//         };

//         request.onupgradeneeded = function(event) {
//             const db = event.target.result;
//             const objectStore = db.createObjectStore("units", { keyPath: "id" });
//         };

//         request.onsuccess = function(event) {
//             const db = event.target.result;
//             const transaction = db.transaction(["units"], "readwrite");
//             const objectStore = transaction.objectStore("units");
//             const addRequest = objectStore.add(unit);

//             addRequest.onsuccess = function(event) {
//                 resolve("Unit added to IndexedDB.");
//             };

//             addRequest.onerror = function(event) {
//                 reject("Could not add unit to IndexedDB.");
//             };
//         };
//     });
// }

// function createUnitElement(unit) {
//     const unitContainer = document.createElement('div');
//     unitContainer.className = 'unit-container';

//     const fields = ['name', 'status', 'priority', 'description', 'tags'];
//     fields.forEach(field => {
//         const elem = document.createElement(field === 'name' ? 'h2' : 'p');
//         elem.textContent = `${field.charAt(0).toUpperCase() + field.slice(1)}: ${Array.isArray(unit[field]) ? unit[field].join(', ') : unit[field]}`;
//         unitContainer.appendChild(elem);
//     });

//     return unitContainer;
// }

// async function hello() {
//   // Instantiate a new unit
//   const newUnit = new Unit(1, 'Create a Unit', 'Active', 'High', 'Units are bits of data that persist from page to page.', ['units', 'welcome']);
//   console.log(newUnit);

//   // Store unit in IndexedDB
//   await storeUnitInDB(newUnit);

//   // Create and append unit element
//   const unitElement = createUnitElement(newUnit);
//   document.body.appendChild(unitElement);
// }

// hello();

// Initialize global tags
//const globalTags = new GlobalTags();

// Create some units
const unit1 = new Unit(1, "Unit1", "active", 1, "First unit", ["tag1", "tag2"]);
const unit2 = new Unit(2, "Unit2", "inactive", 2, "Second unit", ["tag2", "tag3"]);

// Check if tags are in globalTags
console.log(globalTags.hasTag("tag1"));  // Should return true
console.log(globalTags.hasTag("tag4"));  // Should return false

// Add a new tag to globalTags directly
globalTags.addTag("tag4");

// Check again
console.log(globalTags.hasTag("tag4"));  // Should now return true

// Remove a tag
globalTags.removeTag("tag1");

// Check again
console.log(globalTags.hasTag("tag1"));  // Should now return false



