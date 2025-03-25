import type { BoardItemDTO } from '../../../../schemas/zod.js';
import CharacterError from '../../../errors/CharacterError.js';
import type Cell from '../../match/boards/CellBoard.js';
import type Character from '../Character.js';
import Enemy from './Enemy.js';

export default class Troll extends Enemy {
  getDTO(): BoardItemDTO {
    return { type: 'troll' };
  }
  protected move(cellUp: Cell, character: Character | null): void {
    this.cell.setCharacter(null);
    cellUp.setCharacter(this);
    this.cell = cellUp;
    if (character && !character.kill()) {
      character.die(); // If it's a player, it dies.
    }
  }

  protected validateMove(cell: Cell | null): { character: Character | null; cell: Cell } {
    if (!cell) throw new CharacterError(CharacterError.NULL_CELL); // If it's a border it can't move
    if (cell.blocked()) throw new CharacterError(CharacterError.BLOCKED_CELL); // If it's a block object, it can't move
    const character = cell.getCharacter();
    if (character?.kill()) throw new CharacterError(CharacterError.BLOCKED_CELL); // If it's other enemy, it can't move
    return { character, cell };
  }

  calculateMovement(): void {
    // TODO --> Implement Dijkstra algorithm
  }
}
