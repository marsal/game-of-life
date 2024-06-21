import { describe, expect, it } from 'vitest';
import { Cell } from '../src/Components/Cell';
import { Grid } from '../src/Components/Grid';
import { initialGrid, nextGenerationGrid } from './Grid.mock';

describe('Grid', () => {
  it('debería inicializar la cuadrícula correctamente', () => {
    const grid = new Grid();
    const cells = grid.getCells();
    expect(cells.length).toBe(Grid.WIDTH);
    expect(cells.every((row) => row.length === Grid.HEIGHT)).toBe(true);
    expect(
      cells.every((row) => row.every((cell) => cell instanceof Cell)),
    ).toBe(true);
  });

  it('debería calcular la siguiente generación correctamente', () => {
    const grid = new Grid(initialGrid);
    grid.nextGeneration();
    const nextGeneration = grid.getCells();
    expect(nextGeneration).toStrictEqual(nextGenerationGrid);
  });

  it('debería contar los vecinos vivos correctamente', () => {
    const grid = new Grid(initialGrid);
    expect(grid.livingNeighbors(0, 0)).toBe(2);
    expect(grid.livingNeighbors(1, 1)).toBe(3);
    expect(grid.livingNeighbors(2, 2)).toBe(1);
  });
});
