import { z } from 'zod';
import type { BoardItem } from '../app/game/match/boards/BoardItem.js';

const validateMatchInputDTO = (data: unknown): MatchInputDTO => {
  const schema = z.object({
    level: z.number().nonnegative(),
    map: z.string().nonempty(),
  });
  return schema.parse(data);
};

const validateString = (data: unknown): string => {
  const schema = z.string().nonempty().min(1);
  return schema.parse(data);
};

const validateMatchDetails = (data: unknown): MatchDetails => {
  const schema = z.object({
    id: z.string().nonempty(),
    host: z.string().nonempty(),
    guest: z.string().nullable(),
    level: z.preprocess((val) => {
      if (typeof val === 'string') {
        const parsed = Number.parseInt(val, 10);
        return Number.isNaN(parsed) ? undefined : parsed;
      }
      return val;
    }, z.number().nonnegative()),
    map: z.string().nonempty(),
  });
  return schema.parse(data);
};

interface MatchInputDTO {
  level: number;
  map: string;
}
interface MatchDetails {
  id: string;
  host: string;
  guest?: string | null;
  level: number;
  map: string;
}
interface BoardDTO {
  host: string | null;
  guest: string | null;
  fruitType: string;
  enemies: number;
  enemiesCoordinates: number[][];
  fruitsCoordinates: number[][];
  fruits: number;
  playersStartCoordinates: number[][];
  board: CellDTO[][];
}
interface CellDTO {
  x: number;
  y: number;
  item: BoardItemDTO | null;
  character: BoardItemDTO | null;
}
interface BoardItemDTO {
  type: string;
}
interface CellCoordinates {
  x: number;
  y: number;
}
interface MatchDTO {
  id: string;
  level: number;
  map: string;
  host: string;
  guest: string;
  board: BoardDTO;
}

export type {
  MatchInputDTO,
  MatchDetails,
  BoardDTO,
  CellDTO,
  BoardItem,
  BoardItemDTO,
  CellCoordinates,
  MatchDTO,
};
export { validateMatchInputDTO, validateMatchDetails, validateString };
