import { z } from 'zod';

function validateMatchInputDTO(data: unknown): MatchInputDTO {
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
export type { MatchInputDTO, MatchDetails };
export { validateMatchInputDTO, validateString };
