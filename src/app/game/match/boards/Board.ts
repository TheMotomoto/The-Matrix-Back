import type Enemy from '../../characters/enemies/Enemy.js';
import type Cell from './CellBoard.js';
import type Fruit from './Fruit.js';
abstract class Board {
  protected readonly ROWS: number = 16;
  protected readonly COLS: number = 16;
  protected board: Cell[][] = [[]];
  protected enemies: Enemy[] = [];
  protected fruits: Fruit[] = [];
  protected map: string;
  protected level: number;
  constructor(map: string, level: number) {
    this.map = map;
    this.level = level;
    this.generateBoard();
    this.setUpEnemies();
  }
  public abstract generateBoard(): void;
  public abstract setUpEnemies(): void;
  public abstract setUpFruits(): void;

  public getBoard(): Cell[][] {
    return this.board;
  }
  public getEnemies(): Enemy[] {
    return this.enemies;
  }
}
export default Board;
