import { ValidationError } from '../errors/errorTypes';

export class Validators {
  /**
   * Valida que un string no esté vacío
   */
  static isNotEmpty(value: string, fieldName: string): void {
    if (!value || value.trim().length === 0) {
      throw new ValidationError(`${fieldName} no puede estar vacío`);
    }
  }

  /**
   * Valida la longitud mínima de un string
   */
  static minLength(value: string, min: number, fieldName: string): void {
    if (value.length < min) {
      throw new ValidationError(`${fieldName} debe tener al menos ${min} caracteres`);
    }
  }

  /**
   * Valida la longitud máxima de un string
   */
  static maxLength(value: string, max: number, fieldName: string): void {
    if (value.length > max) {
      throw new ValidationError(`${fieldName} no puede exceder ${max} caracteres`);
    }
  }

  /**
   * Valida que un email sea válido
   */
  static isEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Valida que un array tenga un mínimo de elementos
   */
  static arrayMinLength<T>(array: T[], min: number, fieldName: string): void {
    if (array.length < min) {
      throw new ValidationError(`${fieldName} debe tener al menos ${min} elementos`);
    }
  }

  /**
   * Valida que un código de votación sea válido (6 caracteres alfanuméricos)
   */
  static isValidVotingCode(code: string): boolean {
    const codeRegex = /^[A-Z0-9]{6}$/;
    return codeRegex.test(code);
  }

  /**
   * Valida que un valor sea un ObjectId válido de MongoDB
   */
  static isValidObjectId(id: string): boolean {
    const objectIdRegex = /^[a-f\d]{24}$/i;
    return objectIdRegex.test(id);
  }

  /**
   * Valida que un rol sea válido
   */
  static isValidRole(role: string): role is 'admin' | 'voter' {
    return role === 'admin' || role === 'voter';
  }
}