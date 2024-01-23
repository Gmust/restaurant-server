import { BadRequestException } from '@nestjs/common';

export const validateTime = ({ date, message }: { date: Date; message: string }) => {
  if (new Date(date).getTime() < new Date().getTime()) {
    throw new BadRequestException('Table cannot be reserved for a past date');
  }
};
