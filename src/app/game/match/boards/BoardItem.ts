import type Cell from './CellBoard.js';

export abstract class BoardItem {
  protected cell: Cell;
  constructor(cell: Cell) {
    this.cell = cell;
  }
}
