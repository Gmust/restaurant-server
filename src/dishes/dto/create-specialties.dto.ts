import { IsNotEmpty } from 'class-validator';

import { Specialties } from '../../schemas/specialties.schema';

export class CreateSpecialtiesDto {
  @IsNotEmpty()
  specialties: Specialties;
}
