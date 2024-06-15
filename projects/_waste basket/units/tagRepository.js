const db = require('./database');

const addTag = (newTag) => new Promise((resolve, reject) => {
  db.run(`INSERT INTO tags (name) VALUES (?)`, [newTag], function(err) {
    if (err) {
      return reject(err);
    }
    resolve(true);
  });
});

const removeTag = (tagToRemove) => new Promise((resolve, reject) => {
  db.run(`DELETE FROM tags WHERE name = ?`, [tagToRemove], function(err) {
    if (err) {
      return reject(err);
    }
    resolve(this.changes > 0); // True if a tag was removed, false otherwise
  });
});

module.exports = { addTag, removeTag };
