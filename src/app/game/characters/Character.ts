import { BoardItem } from '../match/boards/BoardItem.js';

abstract class Character extends BoardItem {
  public moveUp(): void {}
  public moveDown(): void {}
  public moveLeft(): void {}
  public moveRight(): void {}
  abstract execPower(): void;
  abstract die(): void;
  abstract reborn(): void;
}
export default Character;
