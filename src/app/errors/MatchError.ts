export default class MatchError extends Error {
  public static readonly MATCH_NOT_FOUND = 'The requested match was not found';
  public static readonly MATCH_CANNOT_BE_CREATED = 'The match cannot be created';
  public static readonly PLAYER_NOT_FOUND = 'The requested player was not found';
  public static readonly INVALID_MESSAGE_TYPE = 'The message type is invalid';
  public static readonly INVALID_MOVE = 'The move is invalid';
  public static readonly WIN = 'The players won the match';
  public static readonly PLAYER_ALREADY_IN_MATCH = 'The player is already in a match';
  public static readonly MATCH_ALREADY_STARTED = 'The match has already started';
}
