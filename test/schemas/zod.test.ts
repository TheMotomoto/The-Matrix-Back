import { describe, it, expect } from 'vitest';
import {
  validateMatchInputDTO,
  validateMatchDetails,
  validateString
} from '../../src/schemas/zod.js';

describe('validateMatchInputDTO', () => {
  it('should validate correct match input DTO', () => {
    const validData = {
      level: 2,
      map: 'forest'
    };
    expect(validateMatchInputDTO(validData)).toEqual(validData);
  });

  it('should throw error for negative level', () => {
    const invalidData = {
      level: -1,
      map: 'forest'
    };
    expect(() => validateMatchInputDTO(invalidData)).toThrow();
  });

  it('should throw error for empty map', () => {
    const invalidData = {
      level: 2,
      map: ''
    };
    expect(() => validateMatchInputDTO(invalidData)).toThrow();
  });

  it('should throw error when fields are missing', () => {
    expect(() => validateMatchInputDTO({ level: 2 })).toThrow();
    expect(() => validateMatchInputDTO({ map: 'forest' })).toThrow();
    expect(() => validateMatchInputDTO({})).toThrow();
  });
});

describe('validateMatchDetails', () => {
  it('should validate correct match details with proper numeric level', () => {
    const validData = {
      id: 'match1',
      host: 'Alice',
      guest: null,
      level: 1,
      map: 'desert'
    };
    expect(validateMatchDetails(validData)).toEqual(validData);
  });

  it('should validate match details converting string level to number', () => {
    const inputData = {
      id: 'match2',
      host: 'Bob',
      guest: 'Charlie',
      level: '3', // level as string, should be converted
      map: 'city'
    };
    const expectedOutput = {
      ...inputData,
      level: 3
    };
    expect(validateMatchDetails(inputData)).toEqual(expectedOutput);
  });

  it('should throw error when level is negative', () => {
    const invalidData = {
      id: 'match3',
      host: 'Dave',
      guest: null,
      level: -1,
      map: 'desert'
    };
    expect(() => validateMatchDetails(invalidData)).toThrow();
  });

  it('should throw error when map is empty', () => {
    const invalidData = {
      id: 'match4',
      host: 'Eve',
      guest: null,
      level: 1,
      map: ''
    };
    expect(() => validateMatchDetails(invalidData)).toThrow();
  });

  it('should throw error when required fields are missing', () => {
    // Falta id y host
    expect(() => validateMatchDetails({ level: 1, map: 'desert' })).toThrow();
    // Falta level y map
    expect(() => validateMatchDetails({ id: 'match5', host: 'Frank' })).toThrow();
  });

  it('should throw error when input is not an object', () => {
    expect(() => validateMatchDetails(null)).toThrow();
    expect(() => validateMatchDetails('string')).toThrow();
    expect(() => validateMatchDetails(123)).toThrow();
  });
});

describe('validateString', () => {
  it('should validate non-empty strings', () => {
    expect(validateString('hello')).toBe('hello');
    expect(validateString('a')).toBe('a');
  });

  it('should throw error on empty strings', () => {
    expect(() => validateString('')).toThrow();
  });

  it('should throw error on non-string inputs', () => {
    expect(() => validateString(null)).toThrow();
    expect(() => validateString(undefined)).toThrow();
    expect(() => validateString(123)).toThrow();
    expect(() => validateString({})).toThrow();
    expect(() => validateString([])).toThrow();
  });
});
