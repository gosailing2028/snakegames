"use client";

import React, { useState, useEffect, useRef } from 'react';

const SnakeGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const [speed, setSpeed] = useState(150);

  const snakeRef = useRef([{ x: 10, y: 10 }]);
  const foodRef = useRef({ x: 15, y: 15 });
  const directionRef = useRef({ x: 0, y: -1 });
  const gameIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const gridSize = 20;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (directionRef.current.y === 0) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          if (directionRef.current.y === 0) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          if (directionRef.current.x === 0) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          if (directionRef.current.x === 0) directionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      gameIntervalRef.current = setInterval(updateGame, speed);
    } else {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
      }
    }
    return () => {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
      }
    };
  }, [isPaused, isGameOver, speed]);

  useEffect(() => {
    draw();
  }, [snakeRef.current, foodRef.current]);

  const updateGame = () => {
    const newSnake = [...snakeRef.current];
    const head = { ...newSnake[0] };
    head.x += directionRef.current.x;
    head.y += directionRef.current.y;

    if (
      head.x < 0 ||
      head.x >= gridSize ||
      head.y < 0 ||
      head.y >= gridSize ||
      newSnake.some(segment => segment.x === head.x && segment.y === head.y)
    ) {
      setIsGameOver(true);
      return;
    }

    newSnake.unshift(head);

    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      setScore(prevScore => prevScore + 10);
      generateFood();
    } else {
      newSnake.pop();
    }

    snakeRef.current = newSnake;
    draw();
  };

  const generateFood = () => {
    foodRef.current = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize),
    };
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'green';
    snakeRef.current.forEach(segment => {
      ctx.fillRect(segment.x * (canvas.width / gridSize), segment.y * (canvas.height / gridSize), (canvas.width / gridSize), (canvas.height / gridSize));
    });

    ctx.fillStyle = 'red';
    ctx.fillRect(foodRef.current.x * (canvas.width / gridSize), foodRef.current.y * (canvas.height / gridSize), (canvas.width / gridSize), (canvas.height / gridSize));
  
    if (isGameOver) {
        ctx.fillStyle = 'black';
        ctx.font = '40px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
    }
  };

  const startGame = () => {
    snakeRef.current = [{ x: 10, y: 10 }];
    directionRef.current = { x: 0, y: -1 };
    generateFood();
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  const togglePause = () => {
    if (!isGameOver) {
      setIsPaused(prevPaused => !prevPaused);
    }
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpeed(250 - parseInt(e.target.value, 10) + 50);
  };

  return (
    <div className="container">
      <h1>Snake Game</h1>
      <div className="game-container">
        <canvas ref={canvasRef} className="game-canvas" width="400" height="400"></canvas>
        <div className="score-container">
          Score: <span>{score}</span>
        </div>
      </div>
      <div className="game-controls">
        <button onClick={startGame}>Start Game</button>
        <button onClick={togglePause}>{isPaused ? 'Resume' : 'Pause'}</button>
        <div className="speed-control-container">
          <label htmlFor="speed-control">Speed:</label>
          <input type="range" id="speed-control" min="50" max="250" step="50" defaultValue="150" onChange={handleSpeedChange} />
        </div>
      </div>
      <div className="mobile-controls">
        <button onClick={() => { if (directionRef.current.y === 0) directionRef.current = { x: 0, y: -1 }; }} className="control-button">↑</button>
        <div className="horizontal-buttons">
          <button onClick={() => { if (directionRef.current.x === 0) directionRef.current = { x: -1, y: 0 }; }} className="control-button">←</button>
          <button onClick={() => { if (directionRef.current.x === 0) directionRef.current = { x: 1, y: 0 }; }} className="control-button">→</button>
        </div>
        <button onClick={() => { if (directionRef.current.y === 0) directionRef.current = { x: 0, y: 1 }; }} className="control-button">↓</button>
      </div>
    </div>
  );
};

export default SnakeGame;
''