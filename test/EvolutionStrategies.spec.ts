import { describe, expect, it } from 'vitest';
import { Cell, CellState } from '../src/Components/Cell';
import { StandardEvolutionStrategy } from '../src/Components/EvolutionStrategies';

describe('StandardEvolutionStrategy', async () => {
  const strategy = new StandardEvolutionStrategy();

  const aliveCell = Cell.create(CellState.ALIVE);
  const deadCell = Cell.create(CellState.DEAD);
  it('célula viva con 2 vecinos vivos, debería mantenerse viva', () => {
    expect(strategy.calculateState(aliveCell, 2)).toBe(CellState.ALIVE);
  });

  it('célula viva con 3 vecinos vivos, debería mantenerse viva', () => {
    expect(strategy.calculateState(aliveCell, 3)).toBe(CellState.ALIVE);
  });

  it('célula muerta con 3 vecinos vivos, debería revivir', () => {
    expect(strategy.calculateState(deadCell, 3)).toBe(CellState.ALIVE);
  });

  it('célula viva con menos de 2 vecinos vivos, debería morir por soledad', () => {
    expect(strategy.calculateState(aliveCell, 1)).toBe(CellState.DEAD);
  });

  it('célula viva con más de 3 vecinos vivos, debería morir por sobrepoblación', () => {
    expect(strategy.calculateState(aliveCell, 4)).toBe(CellState.DEAD);
  });

  it('muerta sin vecinos vivos, debería permanecer muerta', () => {
    expect(strategy.calculateState(deadCell, 0)).toBe(CellState.DEAD);
  });
});
