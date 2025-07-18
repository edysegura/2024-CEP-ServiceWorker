import { expect, describe, it } from 'vitest';
import CEP from './CEP.js';

describe('CEP Value Object', () => {
  it('should create a valid CEP instance with numbers only', () => {
    const cep = new CEP('12345678');
    expect(cep.valueOf()).toBe('12345678');
    expect(cep.toString()).toBe('12345-678');
  });

  it('should create a valid CEP instance with masked input', () => {
    const cep = new CEP('12345-678');
    expect(cep.valueOf()).toBe('12345678');
    expect(cep.toString()).toBe('12345-678');
  });

  it('should throw error for CEP with invalid length', () => {
    expect(() => new CEP('1234567')).toThrow('Invalid CEP format');
    expect(() => new CEP('123456789')).toThrow('Invalid CEP format');
  });

  it('should throw error for CEP with non-numeric characters', () => {
    expect(() => new CEP('abcdefgh')).toThrow('Invalid CEP format');
    expect(() => new CEP('123abc45')).toThrow('Invalid CEP format');
  });

  it('should throw error for CEP with all zeros', () => {
    expect(() => new CEP('00000000')).toThrow('Invalid CEP format');
  });

  it('should throw error for empty CEP', () => {
    expect(() => new CEP('')).toThrow('Invalid CEP format');
  });

  it('should throw error for null or undefined CEP', () => {
    expect(() => new CEP(null)).toThrow();
    expect(() => new CEP(undefined)).toThrow();
  });

  it('should handle CEP with spaces and special characters', () => {
    const cep = new CEP(' 12.345-678 ');
    expect(cep.valueOf()).toBe('12345678');
    expect(cep.toString()).toBe('12345-678');
  });
});
