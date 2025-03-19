import { BoardItem } from "./BoardItem.js";
import type Cell from "./CellBoard.js";

export default class Fruit extends BoardItem{
    private name: string;
    constructor(cell:Cell, name:string){
        super(cell);
        this.name = name;
    }   
    public getName():string{
        return this.name;
    }
}