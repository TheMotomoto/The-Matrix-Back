import type Character from './characters/Character.js';

/**
 * The responsability of this class is to represent
 * the behaviour and properties of a cell in the game.
 */
class Cell {
  private xPosition: number;
  private yPosition: number;
  private character: Character | null = null;

  /**
   * Method to create a new cell
   * @param x {number} The x position of the cell
   * @param y {number} The y position of the cell
   */
  constructor(x: number, y: number) {
    this.xPosition = x;
    this.yPosition = y;
  }

  /**
   * This method returns the coordinates of the cell.
   * @returns {x: number, y: number} The coordinates of the cell
   */
  public getCoordinates(): { x: number; y: number } {
    return { x: this.xPosition, y: this.yPosition };
  }
}
export default Cell;
