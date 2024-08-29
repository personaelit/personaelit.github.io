import React, { useState } from 'react';
import { DndProvider, useDrop } from 'react-dnd'; // Add useDrop import
import { HTML5Backend } from 'react-dnd-html5-backend';
import TodoCard from './TodoCard';

const ItemTypes = {
  TODO: 'todo',
};

const EisenhowerView = ({ todos, updateCategory, updatePriority, updateTodo, toggleDone, deleteTodo }) => {
  const [flipped, setFlipped] = useState(Array(todos.length).fill(false));

  const toggleFlip = (index) => {
    const newFlipped = [...flipped];
    newFlipped[index] = !newFlipped[index];
    setFlipped(newFlipped);
  };

  const priorities = [
    'Urgent & Important',
    'Not Urgent & Important',
    'Urgent & Not Important',
    'Not Urgent & Not Important'
  ];

  const moveTodo = (uniqueIndex, newPriority) => {
    if (newPriority && newPriority !== todos[uniqueIndex].priority) {
      updatePriority(uniqueIndex, newPriority);
    }
  };

  const PriorityCell = ({ priority, children }) => {
    const [, drop] = useDrop({
      accept: ItemTypes.TODO,
      drop: (item) => moveTodo(item.uniqueIndex, priority),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    });

    return (
      <div ref={drop} className="eisenhower-cell">
        <h2>{priority}</h2>
        {children}
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="eisenhower-grid">
        {priorities.map(priority => (
          <PriorityCell key={priority} priority={priority}>
            {todos.filter(todo => todo.priority === priority).map((todo, index) => (
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
              />
            ))}
          </PriorityCell>
        ))}
      </div>
    </DndProvider>
  );
};

export default EisenhowerView;
