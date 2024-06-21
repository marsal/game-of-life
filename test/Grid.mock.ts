import { Cell, CellState } from '../src/Components/Cell';

export const initialGrid: Cell[][] = [
  [
    Cell.create(CellState.ALIVE),
    Cell.create(CellState.ALIVE),
    Cell.create(CellState.DEAD),
  ],
  [
    Cell.create(CellState.DEAD),
    Cell.create(CellState.ALIVE),
    Cell.create(CellState.DEAD),
  ],
  [
    Cell.create(CellState.DEAD),
    Cell.create(CellState.DEAD),
    Cell.create(CellState.ALIVE),
  ],
];

export const nextGenerationGrid: Cell[][] = [
  [
    Cell.create(CellState.ALIVE),
    Cell.create(CellState.ALIVE),
    Cell.create(CellState.DEAD),
  ],
  [
    Cell.create(CellState.ALIVE),
    Cell.create(CellState.ALIVE),
    Cell.create(CellState.ALIVE),
  ],
  [
    Cell.create(CellState.DEAD),
    Cell.create(CellState.DEAD),
    Cell.create(CellState.DEAD),
  ],
];
