import React, { useState, useEffect, useRef } from 'react';
import Cell, { CellState } from './Cell';
import { Grid } from './Grid';

// Definimos el tamaño de la cuadrícula
const GRID_WIDTH = 40;
const GRID_HEIGHT = 40;

// Definimos las posibles direcciones de los vecinos
const NEIGHBOR_OFFSETS = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
];

const GameOfLife: React.FC = () => {

  const grid = useRef(Grid.initialize());

  const calculateNextGeneration = () => {
    const newGrid = grid.map((row, y) =>
      row.map((cell, x) => {
        const livingNeighbors = NEIGHBOR_OFFSETS.reduce((count, [dx, dy]) => {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < GRID_WIDTH && ny >= 0 && ny < GRID_HEIGHT) {
            return count + (grid[ny][nx].askIfAlive() ? 1 : 0);
          }
          return count;
        }, 0);

        if (
          cell.askIfAlive() &&
          (livingNeighbors === 2 || livingNeighbors === 3)
        ) {
          return new Cell(CellState.ALIVE);
        }

        if (cell.askIfDead() && livingNeighbors === 3) {
          return new Cell(CellState.ALIVE);
        }

        return new Cell(CellState.DEAD);
      }),
    );
    setGrid(newGrid);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      calculateNextGeneration();
    }, 100);
    return () => clearInterval(intervalId);
  }, [grid]);

  return (
    <div>
      {grid.map((row, y) => (
        <div key={y} style={{ display: 'flex' }}>
          {row.map((cell, x) => (
            <div
              key={x}
              style={{
                width: 20,
                height: 20,
                backgroundColor: cell ? 'green' : 'white',
                border: '1px solid black',
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameOfLife;
