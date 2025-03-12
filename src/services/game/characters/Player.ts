import type Cell from '../CellBoard.js';
import Character from './Character.js';

/**
 * This class represents the behaviour and the properties
 * of a player in the game of bad-ice-cream.
 */
class Player extends Character {
  private id: string;
  private cell: Cell;

  /**
   * Method to create a new player
   * @param id {string} The id of the player
   * @param cell {Cell} the cell where the player is located
   */
  constructor(id: string, cell: Cell) {
    super();
    this.id = id;
    this.cell = cell;
  }

  public getCoordinates(): { x: number; y: number } {
    return this.cell.getCoordinates();
  }
}
export default Player;
