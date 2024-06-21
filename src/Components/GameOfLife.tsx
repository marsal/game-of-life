import React, { useEffect, useMemo, useState } from 'react';
import { Grid } from './Grid';

const GameOfLife: React.FC = () => {
  const grid = useMemo(() => new Grid(), []);
  const [cels, setCells] = useState(grid.getCells());

  useEffect(() => {
    const intervalId = setInterval(() => {
      grid.nextGeneration();
      setCells(grid.getCells());
    }, 100);
    return () => clearInterval(intervalId);
  }, [grid]);

  return (
    <div>
      {cels.map((row, y) => (
        <div key={y} style={{ display: 'flex' }}>
          {row.map((cel, x) => (
            <div key={x} className={`cel ${cel.isDead() ? 'dead' : 'alive'}`} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameOfLife;
