import { Validators } from '../../../shared/utils/validators';
import { ValidationError } from '../../../shared/errors/errorTypes';

export interface CastVoteDto {
  votingId: string;
  optionId: string;
}

export class CastVoteDtoValidator {
  static validate(data: any): CastVoteDto {
    // Validar que existan los campos
    if (!data.votingId || !data.optionId) {
      throw new ValidationError('ID de votación y ID de opción son requeridos');
    }

    // Validar que sean strings
    if (typeof data.votingId !== 'string' || typeof data.optionId !== 'string') {
      throw new ValidationError('IDs deben ser texto');
    }

    // Validar formato de IDs
    Validators.isNotEmpty(data.votingId, 'ID de votación');
    Validators.isNotEmpty(data.optionId, 'ID de opción');

    return {
      votingId: data.votingId.trim(),
      optionId: data.optionId.trim(),
    };
  }
}