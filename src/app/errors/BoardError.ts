import ErrorTemplate from './ErrorTemplate.js';
const errors = {
  USER_NOT_DEFINED: 400,
};
export default class BoardError extends ErrorTemplate {
  public static readonly USER_NOT_DEFINED = 'The user is not defined';
  constructor(message: string) {
    super(message, errors[message as keyof typeof errors]);
  }
}
