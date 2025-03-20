import type Enemy from '../../characters/enemies/Enemy.js';
import type Player from '../../characters/players/Player.js';
import type Cell from './CellBoard.js';
import type Fruit from './Fruit.js';
abstract class Board {
  protected readonly ROWS: number = 16;
  protected readonly COLS: number = 16;
  protected readonly host: Player;
  protected readonly guest: Player;
  protected readonly map: string;
  protected readonly level: number;
  protected board: Cell[][] = [[]];
  protected enemies: Enemy[] = [];
  protected fruits: Fruit[] = [];
  constructor(map: string, level: number, host: Player, guest: Player) {
    this.map = map;
    this.level = level;
    this.host = host;
    this.guest = guest;
    this.generateBoard();
    this.setUpEnemies();
    this.setUpFruits();
    this.setUpPlayers();
    this.setUpInmovableObjects();
  }
  public abstract generateBoard(): void;
  public abstract setUpEnemies(): void;
  public abstract setUpFruits(): void;
  public abstract setUpPlayers(): void;
  public abstract setUpInmovableObjects(): void;

  public getBoard(): Cell[][] {
    return this.board;
  }
  public getEnemies(): Enemy[] {
    return this.enemies;
  }
}
export default Board;
