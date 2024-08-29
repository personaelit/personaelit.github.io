import React, { useState, useEffect } from 'react';
import KanbanView from './Components/KanbanView';
import EisenhowerView from './Components/EisenhowerView';
import './App.css';

function App() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [input, setInput] = useState('');
  const [view, setView] = useState('kanban');

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
        priority: 'Urgent & Important'
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
    const newTodos = todos.map((todo, i) => (i === index ? { ...todo, text: newValue } : todo));
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

  const toggleDone = (index) => {
    const newTodos = todos.map((todo, i) => (i === index ? { ...todo, done: !todo.done } : todo));
    setTodos(newTodos);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
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
        </div>
        {view === 'kanban' ? (
          <KanbanView
            todos={todos}
            updateCategory={updateCategory}
            updatePriority={updatePriority}
            updateTodo={updateTodo}
            toggleDone={toggleDone}
            deleteTodo={deleteTodo}
          />
        ) : (
          <EisenhowerView
            todos={todos}
            updateCategory={updateCategory}
            updatePriority={updatePriority}
            updateTodo={updateTodo}
            toggleDone={toggleDone}
            deleteTodo={deleteTodo}
          />
        )}
      </header>
    </div>
  );
}

export default App;
