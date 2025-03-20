import type Cell from './CellBoard.js';

export abstract class BoardItem {
  protected cell: Cell;
  public abstract blocked(): boolean;
  constructor(cell: Cell) {
    this.cell = cell;
  }
}
