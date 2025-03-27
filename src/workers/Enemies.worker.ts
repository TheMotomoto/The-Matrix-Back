import { parentPort, workerData } from 'node:worker_threads';
import type GameService from '../app/game/services/GameService.js';
import GameServiceImpl from '../app/game/services/GameServiceImpl.js';
import WorkerError from './WorkerError.js';

if (!parentPort) {
  throw new Error('Este script debe ejecutarse como un worker thread');
}
const gameService: GameService = GameServiceImpl.getInstance();
const { matchId, enemyId } = workerData as { matchId: string; enemyId: string };
const match = gameService.getMatch(matchId);
const enemy = match?.getEnemies().get(enemyId);
if (!enemy) throw new WorkerError(WorkerError.ENEMY_NOT_FOUND);
const movement = async () => {
  await enemy.calculateMovement();
};
movement();

setInterval(movement, 1000);
