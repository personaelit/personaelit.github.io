import React from 'react';

const ListView = ({ todos, updateCategory, updatePriority, updateTodo, toggleDone, deleteTodo, onCardClick }) => {
  return (
    <div className="list-view">
      {todos.map((todo, index) => (
        <div key={index} className="todo-item" onClick={() => onCardClick(todo)}>
          <h3>{todo.text}</h3>
          <p>{todo.category} - {todo.priority}</p>
          <button onClick={() => toggleDone(index)}>{todo.done ? 'Undo' : 'Done'}</button>
          <button onClick={() => deleteTodo(index)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default ListView;
