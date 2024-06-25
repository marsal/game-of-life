import { describe, expect, test } from 'vitest';
import Cell, { CellState } from '../src/Components/Cell';

describe('Cell class', () => {
  test('When create a alive cell, then the cell state should be alive', () => {
    const cell = new Cell(CellState.ALIVE);

    expect(cell.askIfAlive()).toBeTruthy();
  });

  test('When create a dead cell, then the cell state should be dead', () => {
    const cell = new Cell(CellState.DEAD);

    expect(cell.askIfAlive()).toBeFalsy();
  });

  test('When change a cell state from alive to dead, should be dead', () => {
    const cell = new Cell(CellState.ALIVE);

    cell.changeState(CellState.DEAD);

    expect(cell.askIfAlive()).toBeFalsy();
  });
});
