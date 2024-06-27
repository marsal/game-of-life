import React, { useEffect, useRef, useState } from 'react';
import { Grid } from './Grid';

const GameOfLife: React.FC = () => {
  const grid = useRef(Grid.initialize());
  const [cells, setCells] = useState(grid.current.getCells());
  useEffect(() => {
    const intervalId = setInterval(() => {
      grid.current.calculateNextGeneration();
      setCells(grid.current.getCells());
    }, 100);
    return () => clearInterval(intervalId);
  }, [grid]);

  return (
    <div>
      {cells.map((row, y) => (
        <div key={y} style={{ display: 'flex' }}>
          {row.map((cell, x) => (
            <div
              key={x}
              style={{
                width: 20,
                height: 20,
                backgroundColor: cell.askIfAlive() ? 'green' : 'white',
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
