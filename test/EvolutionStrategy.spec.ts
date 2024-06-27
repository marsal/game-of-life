import { describe, expect, test } from 'vitest';
import Cell, { CellState } from '../src/Components/Cell';
import { EvolutionStrategy } from '../src/Components/EvolutionStrategy';

const strategy = new EvolutionStrategy();

describe('EvolutionStrategy class', () => {
  test('When giving alive cell and 2 livingNeighbors it returns an Alive cellState', () => {
    const cell = new Cell(CellState.ALIVE);
    const livingNeighbors = 2;
    const state = strategy.calculateState(cell, livingNeighbors);

    expect(state).toBe(CellState.ALIVE);
  });

  test('When giving alive cell and 3 livingNeighbors it returns an Alive cellState', () => {
    const cell = new Cell(CellState.ALIVE);
    const livingNeighbors = 3;
    const state = strategy.calculateState(cell, livingNeighbors);

    expect(state).toBe(CellState.ALIVE);
  });

  test('When giving alive cell and 4 or more livingNeighbors it returns an Dead cellState', () => {
    const cell = new Cell(CellState.ALIVE);
    const livingNeighbors = 4;
    const state = strategy.calculateState(cell, livingNeighbors);

    expect(state).toBe(CellState.DEAD);
  });

  test('When giving alive cell and 1 or less livingNeighbors it returns an Dead cellState', () => {
    const cell = new Cell(CellState.ALIVE);
    const livingNeighbors = 1;
    const state = strategy.calculateState(cell, livingNeighbors);

    expect(state).toBe(CellState.DEAD);
  });

  test('When giving dead cell and 3 livingNeighbors it returns an Alive cellState', () => {
    const cell = new Cell(CellState.DEAD);
    const livingNeighbors = 3;
    const state = strategy.calculateState(cell, livingNeighbors);

    expect(state).toBe(CellState.ALIVE);
  });

  test('When giving dead cell and different of 3 livingNeighbors it returns an Dead cellState', () => {
    const cell = new Cell(CellState.DEAD);
    const livingNeighbors = 1;
    const state = strategy.calculateState(cell, livingNeighbors);

    expect(state).toBe(CellState.DEAD);
  });
});
