import type Enemy from '../../characters/enemies/Enemy.js';
import type Player from '../../characters/players/Player.js';
import type Cell from './CellBoard.js';
import type { CellCoordinates } from './CellBoard.js';
import type Fruit from './Fruit.js';
abstract class Board {
  protected readonly ROWS: number = 16;
  protected readonly COLS: number = 16;
  protected host: Player | null = null;
  protected guest: Player | null = null;
  protected readonly map: string;
  protected readonly level: number;
  protected board: Cell[][] = [[]];
  protected enemies: Enemy[] = [];
  protected fruits: Map<CellCoordinates, Fruit> = new Map();
  protected fruitsNumber = 0;

  public abstract generateBoard(): void;
  public abstract setUpEnemies(): void;
  public abstract setUpFruits(): void;
  public abstract setUpPlayers(host: string, guest: string): void;
  public abstract setUpInmovableObjects(): void;

  constructor(map: string, level: number) {
    this.map = map;
    this.level = level;
    this.generateBoard();
    this.setUpEnemies();
    this.setUpFruits();
    this.setUpInmovableObjects();
  }

  public removeFruit({ x, y }: CellCoordinates): void {
    this.board[x][y].setItem(null);
    this.fruitsNumber--;
    this.fruits.delete({ x, y });
  }

  public getBoard(): Cell[][] {
    return this.board;
  }
  public getEnemies(): Enemy[] {
    return this.enemies;
  }

  public start(host: string, guest: string): void {
    this.setUpPlayers(host, guest);
    // TODO
    // Start threads of enemies
  }
}
export default Board;
