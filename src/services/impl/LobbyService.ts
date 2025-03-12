import LobbyController from '../../controllers/websockets/LobbyController.js';
import type Player from '../game/characters/Player.js';
import MatchMaking from './Matchmaking.js';

class LobbyService {
  private matchMaking: MatchMaking;
  private lobbyController: LobbyController;
  private constructor() {
    this.matchMaking = MatchMaking.getInstance();
    this.lobbyController = LobbyController.getInstance();
  }

  matchMake(_player: Player): void {
    //this.matchMaking.enqueue(player);
  }
}

export default LobbyService;
