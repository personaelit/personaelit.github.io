import React, { useState, useRef, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TodoCard from './TodoCard';

const ItemTypes = {
  TODO: 'todo',
};

const KanbanView = ({ todos, updateCategory, updatePriority, updateTodo, toggleDone, deleteTodo, onCardClick }) => {
  const [flipped, setFlipped] = useState(Array(todos.length).fill(false));
  const [highlightedColumn, setHighlightedColumn] = useState(null);
  const columnRefs = useRef([]);

  const toggleFlip = (index) => {
    const newFlipped = [...flipped];
    newFlipped[index] = !newFlipped[index];
    setFlipped(newFlipped);
  };

  const categories = ['To Do', 'In Progress', 'Done'];

  const moveTodo = (uniqueIndex, newCategory) => {
    if (newCategory && newCategory !== todos[uniqueIndex].category) {
      updateCategory(uniqueIndex, newCategory);
    }
  };

  const Column = ({ category, children }) => {
    const [, drop] = useDrop({
      accept: ItemTypes.TODO,
      drop: (item) => moveTodo(item.uniqueIndex, category),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    });

    return (
      <div ref={drop} className={`kanban-column ${highlightedColumn === category ? 'highlighted' : ''}`}>
        <h2>{category}</h2>
        {children}
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="kanban-board">
        {categories.map((category) => (
          <Column key={category} category={category}>
            {todos.filter(todo => todo.category === category).map((todo, index) => (
              <TodoCard
                key={index}
                todo={todo}
                index={index}
                todos={todos}
                updateTodo={updateTodo}
                toggleDone={toggleDone}
                deleteTodo={deleteTodo}
                toggleFlip={toggleFlip}
                flipped={flipped}
                onCardClick={onCardClick}
              />
            ))}
          </Column>
        ))}
      </div>
    </DndProvider>
  );
};

export default KanbanView;
