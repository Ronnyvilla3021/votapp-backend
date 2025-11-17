import { Validators } from '../../../shared/utils/validators';
import { ValidationError } from '../../../shared/errors/errorTypes';

export interface LoginDto {
  name: string;
  password: string;
}

export class LoginDtoValidator {
  static validate(data: any): LoginDto {
    // Validar que existan los campos
    if (!data.name || !data.password) {
      throw new ValidationError('Nombre y contraseña son requeridos');
    }

    // Validar nombre
    Validators.isNotEmpty(data.name, 'Nombre');
    Validators.minLength(data.name, 3, 'Nombre');

    // Validar contraseña
    Validators.isNotEmpty(data.password, 'Contraseña');
    Validators.minLength(data.password, 6, 'Contraseña');

    return {
      name: data.name.trim(),
      password: data.password,
    };
  }
}