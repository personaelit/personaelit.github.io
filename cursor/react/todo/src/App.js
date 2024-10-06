import React, { useState, useEffect } from 'react';
import KanbanView from './Components/KanbanView';
import EisenhowerView from './Components/EisenhowerView';
import Modal from './Components/Modal';
import './App.css';
import ListView from './Components/ListView'; // Add this import

function App() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [input, setInput] = useState('');
  const [view, setView] = useState('kanban');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState(''); // Add this line

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (input.trim()) {
      const newTodo = {
        text: input,
        timestamp: new Date().toLocaleString(),
        done: false,
        category: 'To Do',
        priority: 'Urgent & Important',
        notes: '',
        dueDate: '', // Add dueDate property
      };
      setTodos([...todos, newTodo]);
      setInput('');
    }
  };

  const deleteTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  const updateTodo = (index, newValue) => {
    const newTodos = todos.map((todo, i) => (i === index ? { ...todo, ...newValue } : todo)); // Spread newValue
    setTodos(newTodos);
  };

  const updateCategory = (index, newCategory) => {
    const newTodos = todos.map((todo, i) => (i === index ? { ...todo, category: newCategory } : todo));
    setTodos(newTodos);
  };

  const updatePriority = (index, newPriority) => {
    const newTodos = todos.map((todo, i) => (i === index ? { ...todo, priority: newPriority } : todo));
    setTodos(newTodos);
  };

  const updateNotes = (index, newNotes) => {
    const newTodos = todos.map((todo, i) => (i === index ? { ...todo, notes: newNotes } : todo));
    setTodos(newTodos);
  };

  const toggleDone = (index) => {
    const newTodos = todos.map((todo, i) => (i === index ? { ...todo, done: !todo.done } : todo));
    setTodos(newTodos);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const handleCardClick = (todo) => {
    setSelectedTodo(todo);
    setNotes(todo.notes || '');
    setDueDate(todo.dueDate || ''); // Add dueDate state
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (selectedTodo) {
      const index = todos.findIndex(todo => todo === selectedTodo);
      updateNotes(index, notes);
      updateTodo(index, { dueDate }); // Update dueDate
    }
    setIsModalOpen(false);
    setSelectedTodo(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Todo App</h1>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new todo"
        />
        <button onClick={addTodo}>Add Todo</button>
        <div className="view-buttons">
          <button onClick={() => setView('kanban')}>Kanban View</button>
          <button onClick={() => setView('eisenhower')}>Eisenhower View</button>
          <button onClick={() => setView('list')}>List View</button> {/* Add this button */}
        </div>
        {view === 'kanban' ? (
          <KanbanView
            todos={todos}
            updateCategory={updateCategory}
            updatePriority={updatePriority}
            updateTodo={updateTodo}
            toggleDone={toggleDone}
            deleteTodo={deleteTodo}
            onCardClick={handleCardClick}
          />
        ) : view === 'eisenhower' ? (
          <EisenhowerView
            todos={todos}
            updateCategory={updateCategory}
            updatePriority={updatePriority}
            updateTodo={updateTodo}
            toggleDone={toggleDone}
            deleteTodo={deleteTodo}
            onCardClick={handleCardClick}
          />
        ) : (
          <ListView // Add this line
            todos={todos}
            updateCategory={updateCategory}
            updatePriority={updatePriority}
            updateTodo={updateTodo}
            toggleDone={toggleDone}
            deleteTodo={deleteTodo}
            onCardClick={handleCardClick}
          />
        )}
      </header>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {selectedTodo && (
          <div>
            <h2>{selectedTodo.text}</h2>
            <p>{selectedTodo.timestamp}</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes here..."
              className="notes-textarea"
            />
            <input
              type="date" // Add this input for due date
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="due-date-input"
            />
          </div>
        )}
      </Modal>
    </div>
  );
}

export default App;
