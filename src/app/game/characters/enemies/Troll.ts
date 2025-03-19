import Enemy from "./Enemy.js";

export default class Troll extends Enemy{
    calculateMovement(): void {
        throw new Error("Method not implemented.");
    }
    execPower(): void {
        throw new Error("Method not implemented.");
    }
    die(): void {
        throw new Error("Method not implemented.");
    }
    reborn(): void {
        throw new Error("Method not implemented.");
    }
}