import React, { useRef, useEffect, useCallback } from 'react';
import { useDrag } from 'react-dnd';

const ItemTypes = {
  TODO: 'todo',
};

const TodoCard = ({ todo, index, todos, updateTodo, toggleDone, deleteTodo, onCardClick }) => {
  const uniqueIndex = todos.findIndex((t) => t === todo);

  // Hooks must be called unconditionally
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TODO,
    item: { uniqueIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const isEditingRef = useRef(false);

  // Check that 'todo' is a valid object before rendering
  const isValidTodo = typeof todo === 'object' && todo !== null;

  const handleTextChange = useCallback(
    (e) => {
      const updatedTodo = { ...todo, text: e.target.value };
      updateTodo(uniqueIndex, updatedTodo);
    },
    [todo, uniqueIndex, updateTodo]
  );

  // Safely extract and render fields if todo is valid
  const safeText = isValidTodo && typeof todo.text === 'string' ? todo.text : '';
  const safeTimestamp = isValidTodo && typeof todo.timestamp === 'string' ? todo.timestamp : '';

  if (!isValidTodo) {
    console.error('Invalid todo object:', todo);
  }

  return (
    <div
      ref={drag}
      className={`todo-card ${isValidTodo && todo.done ? 'done' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onClick={() => onCardClick(todo)}
    >
      {isValidTodo ? (
        <>
          <div className="todo-card-front">
            <input
              type="text"
              value={safeText}
              onChange={handleTextChange}
              onClick={(e) => e.stopPropagation()} // Prevent card flip
            />
            <div className="button-group">
              <button
                className="done-button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDone(uniqueIndex);
                }}
              >
                {todo.done ? 'Not Done' : 'Done'}
              </button>
              <button
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTodo(uniqueIndex);
                }}
              >
                Delete
              </button>
            </div>
            <div className="category">
              Category:
              <select
                className="select-category"
                value={todo.category || 'To Do'}
                onChange={(e) => updateTodo(uniqueIndex, { ...todo, category: e.target.value })}
                onClick={(e) => e.stopPropagation()}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
            <div className="priority">
              Priority:
              <select
                className="select-priority"
                value={todo.priority || 'Not Urgent & Not Important'}
                onChange={(e) => updateTodo(uniqueIndex, { ...todo, priority: e.target.value })}
                onClick={(e) => e.stopPropagation()}
              >
                <option value="Urgent & Important">Urgent & Important</option>
                <option value="Not Urgent & Important">Not Urgent & Important</option>
                <option value="Urgent & Not Important">Urgent & Not Important</option>
                <option value="Not Urgent & Not Important">Not Urgent & Not Important</option>
              </select>
            </div>
            <div className="timestamp">{safeTimestamp}</div>
          </div>
        </>
      ) : (
        <div className="error-message">Invalid Todo Item</div>
      )}
    </div>
  );
};

export default TodoCard;
