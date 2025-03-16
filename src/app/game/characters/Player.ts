//import PlayerError from 'src/services/impl/PlayerError.js';
import PlayerError from '../../errors/PlayerError.js';
import type Cell from '../match/CellBoard.js';
import Character from './Character.js';

/**
 * This class represents the behaviour and the properties
 * of a player in the game of bad-ice-cream.
 */
class Player extends Character {
  private id: string;
  private cell: Cell | null;

  /**
   * This method returns the id of the player
   * @returns {string} The id of the player
   */
  public getId(): string {
    return this.id;
  }

  /**
   * Method to create a new player
   * @param id {string} The id of the player
   * @param cell {Cell} the cell where the player is located
   */
  constructor(id: string, cell: Cell | null) {
    super();
    this.id = id;
    this.cell = cell;
  }

  public getCoordinates(): { x: number; y: number } {
    if (this.cell === null) throw new PlayerError(PlayerError.NULL_CELL);
    return this.cell.getCoordinates();
  }
}
export default Player;
