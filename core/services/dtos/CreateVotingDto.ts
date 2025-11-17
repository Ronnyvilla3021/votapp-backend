import { Validators } from '../../../shared/utils/validators';
import { ValidationError } from '../../../shared/errors/errorTypes';

export interface CreateVotingDto {
  title: string;
  description?: string;
  options: string[];
}

export class CreateVotingDtoValidator {
  static validate(data: any): CreateVotingDto {
    // Validar que existan los campos requeridos
    if (!data.title) {
      throw new ValidationError('El título es requerido');
    }

    if (!data.options || !Array.isArray(data.options)) {
      throw new ValidationError('Las opciones son requeridas y deben ser un array');
    }

    // Validar título
    Validators.isNotEmpty(data.title, 'Título');
    Validators.minLength(data.title, 5, 'Título');
    Validators.maxLength(data.title, 200, 'Título');

    // Validar descripción (opcional)
    if (data.description) {
      Validators.maxLength(data.description, 500, 'Descripción');
    }

    // Validar opciones
    Validators.arrayMinLength(data.options, 2, 'Opciones');

    // Validar que cada opción no esté vacía
    const cleanOptions = data.options
      .map((opt: any) => {
        if (typeof opt !== 'string') {
          throw new ValidationError('Cada opción debe ser un texto');
        }
        return opt.trim();
      })
      .filter((opt: string) => opt.length > 0);

    if (cleanOptions.length < 2) {
      throw new ValidationError('Debe haber al menos 2 opciones válidas');
    }

    if (cleanOptions.length > 10) {
      throw new ValidationError('No puede haber más de 10 opciones');
    }

    // Validar que no haya opciones duplicadas
    const uniqueOptions = new Set(cleanOptions);
    if (uniqueOptions.size !== cleanOptions.length) {
      throw new ValidationError('No puede haber opciones duplicadas');
    }

    return {
      title: data.title.trim(),
      description: data.description?.trim(),
      options: cleanOptions,
    };
  }
}