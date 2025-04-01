import ErrorTemplate from './ErrorTemplate.js';

const errors = {
  BLOCKED_CELL: 400,
  INVALID_CELL: 400,
  INVALID_MOVEMENT: 400,
  OUT_OF_BOUNDS: 400,
  NULL_CELL: 400,
  NOT_FOUND: 404,
};
export default class CharacterError extends ErrorTemplate {
  public static readonly NOT_FOUND = 'Player not found';
  public static readonly NULL_CELL = 'Player has no cell';
  public static readonly INVALID_CELL = 'Invalid cell';
  public static readonly INVALID_MOVEMENT = 'The movement is invalid';
  public static readonly OUT_OF_BOUNDS = 'The movement is out of bounds';
  public static readonly BLOCKED_CELL = 'The cell is blocked';
  constructor(message: string) {
    super(message, errors[message as keyof typeof errors]);
  }
}
