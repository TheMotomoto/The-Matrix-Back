import { describe, it, expect } from 'vitest';
import { validateMatchDetails, validateString, MatchDetails } from '../../src/schemas/zod.js';

describe('validateMatchDetails', () => {
    it('should validate correct match details', () => {
        const validData = {
            level: 1,
            map: 'desert'
        };

        const result = validateMatchDetails(validData);
        expect(result).toEqual(validData);
    });

    it('should throw error when level is negative', () => {
        const invalidData = {
            level: -1,
            map: 'desert'
        };

        expect(() => validateMatchDetails(invalidData)).toThrow();
    });

    it('should throw error when map is empty', () => {
        const invalidData = {
            level: 1,
            map: ''
        };

        expect(() => validateMatchDetails(invalidData)).toThrow();
    });

    it('should throw error when fields are missing', () => {
        expect(() => validateMatchDetails({ level: 1 })).toThrow();
        expect(() => validateMatchDetails({ map: 'desert' })).toThrow();
        expect(() => validateMatchDetails({})).toThrow();
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