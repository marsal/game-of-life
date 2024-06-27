import Cell from './Cell';

export class Grid {
  static height = 40;
  static width = 40;

  constructor(private cells: Cell[][]) {}
  static initialize() {
    const cells = Array.from({ length: this.height }, () =>
      Array.from({ length: this.width }, () => Cell.newRandom()),
    );
    return new Grid(cells);
  }
}
