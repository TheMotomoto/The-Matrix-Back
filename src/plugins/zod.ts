import type Match from 'src/services/game/Match.js';
import { z } from 'zod';

function validateMatchDetails(data: unknown): MatchDetails {
  const schema = z.object({
    level: z.number().nonnegative(),
    map: z.string().nonempty(),
  });
  return schema.parse(data);
}

function validateString(data: unknown): string {
  const schema = z.string().nonempty().min(1);
  return schema.parse(data);
}
interface MatchDetails {
  level: number;
  map: string;
}
export type { MatchDetails };
export { validateMatchDetails, validateString };
