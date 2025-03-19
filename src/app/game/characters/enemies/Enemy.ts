import Character from '../Character.js';

export default abstract class Enemy extends Character {
  abstract calculateMovement(): void;
}
