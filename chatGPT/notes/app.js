const noteForm = document.getElementById('note-form');
const tagForm = document.getElementById('tag-form');
const notesDisplay = document.getElementById('notes-display');
const notes = [];

noteForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const noteInput = document.getElementById('note-input').value;
  notes.push({
    note: noteInput,
    tags: []
  });
});

tagForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const tagInput = document.getElementById('tag-input').value;
  const tags = tagInput.split(',');
  notes[notes.length - 1].tags = tags;
  displayNotes();
});

function displayNotes() {
  notesDisplay.innerHTML = '';
  notes.forEach((note) => {
    const noteDiv = document.createElement('div');
    noteDiv.innerHTML = `<h2>${note.note}</h2><p>Tags: ${note.tags.join(', ')}</p>`;
    notesDisplay.appendChild(noteDiv);
  });
}
