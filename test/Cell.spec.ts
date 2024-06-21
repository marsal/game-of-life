import { describe, expect, it } from 'vitest';
import { Cell, CellState } from '../src/Components/Cell';

describe('Cell', () => {
  it('debería crear una célula viva', () => {
    const aliveCell = Cell.create(CellState.ALIVE);
    expect(aliveCell.isAlive()).toBe(true);
    expect(aliveCell.isDead()).toBe(false);
  });

  it('debería crear una célula muerta', () => {
    const deadCell = Cell.create(CellState.DEAD);
    expect(deadCell.isAlive()).toBe(false);
    expect(deadCell.isDead()).toBe(true);
  });

  it('debería establecer el estado de la célula', () => {
    const cell = Cell.create(CellState.DEAD);
    cell.setState(CellState.ALIVE);
    expect(cell.isAlive()).toBe(true);
    expect(cell.isDead()).toBe(false);
  });

  it('el método random debería generar células dentro de los rangos esperados', () => {
    let countDead = 0;
    const iterations = 1000;

    for (let i = 0; i < iterations; i++) {
      const randomCell = Cell.random();
      if (!randomCell.isAlive()) {
        countDead++;
      }
    }
    // Al ser un random aplicamos un margen de error de 0.05 a la probabilidad
    expect(countDead / iterations).toBeGreaterThanOrEqual(
      Cell.ALIVE_RANDOM_PROBABILITY - 0.05,
    );
  });

  it('el método random debería devolver una instancia de Cell', () => {
    const randomCell = Cell.random();
    expect(randomCell instanceof Cell).toBe(true);
  });
});
