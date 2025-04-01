import ErrorTemplate from './ErrorTemplate.js';
const errors = {
  MATCH_NOT_FOUND: 404,
  MATCH_CANNOT_BE_CREATED: 409,
  PLAYER_NOT_FOUND: 404,
  INVALID_MESSAGE_TYPE: 400,
  INVALID_MOVE: 400,
  WIN: 202,
  PLAYER_ALREADY_IN_MATCH: 409,
  MATCH_ALREADY_STARTED: 409,
};
export default class MatchError extends ErrorTemplate {
  public static readonly MATCH_NOT_FOUND = 'The requested match was not found';
  public static readonly MATCH_CANNOT_BE_CREATED = 'The match cannot be created';
  public static readonly PLAYER_NOT_FOUND = 'The requested player was not found';
  public static readonly INVALID_MESSAGE_TYPE = 'The message type is invalid';
  public static readonly INVALID_MOVE = 'The move is invalid';
  public static readonly WIN = 'The players won the match';
  public static readonly PLAYER_ALREADY_IN_MATCH = 'The player is already in a match';
  public static readonly MATCH_ALREADY_STARTED = 'The match has already started';
  constructor(message: string) {
    super(message, errors[message as keyof typeof errors]);
  }
}
