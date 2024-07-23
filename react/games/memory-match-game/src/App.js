// src/App.js
import React from 'react';
import GameBoard from './GameBoard';
import './App.css';

function App() {
  return (
    <div className="app">
      <h1>Memory Match Game</h1>
      <GameBoard />
    </div>
  );
}

export default App;
