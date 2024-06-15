const fs = require('fs');

class GlobalTags {
  constructor() {
    if (!GlobalTags.instance) {
      try {
        const data = fs.readFileSync('globalTags.json', 'utf8');
        this.tags = new Set(JSON.parse(data));
      } catch (err) {
        this.tags = new Set();
      }
      GlobalTags.instance = this;
    }
    return GlobalTags.instance;
  }

  save() {
    fs.writeFileSync('globalTags.json', JSON.stringify(Array.from(this.tags)));
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

class Unit {
  constructor(id, name, status, priority, description, tags = [], globalTags) {
    this.id = id;
    this.name = name;
    this.status = status;
    this.priority = priority;
    this.description = description;
    this.tags = tags;
    tags.forEach(tag => globalTags.addTag(tag));
  }
}

module.exports = { GlobalTags, Unit };
