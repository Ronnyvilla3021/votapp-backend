import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export class PasswordUtil {
  /**
   * Hashea una contraseña usando bcrypt
   * @param password - Contraseña en texto plano
   * @returns Contraseña hasheada
   */
  static async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, SALT_ROUNDS);
  }

  /**
   * Compara una contraseña en texto plano con un hash
   * @param password - Contraseña en texto plano
   * @param hashedPassword - Contraseña hasheada
   * @returns true si coinciden, false si no
   */
  static async compare(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  /**
   * Valida que una contraseña cumpla con requisitos mínimos
   * @param password - Contraseña a validar
   * @returns true si es válida
   */
  static validate(password: string): boolean {
    // Mínimo 6 caracteres
    return password.length >= 6;
  }
}