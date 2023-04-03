import { BadRequestException } from '@nestjs/common';
import { validateBr } from 'js-brasil';

export const checkIfValidUUID = (str: string): boolean => {
  const regexExp =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

  return regexExp.test(str);
};

export const checkIfIsValidDocument = (document: string) => {
  const documentLength: number = document.length;

  if (!documentLength) {
    throw new BadRequestException('Documento não informado para validação');
  }

  if (documentLength < 11 || documentLength > 14) {
    throw new BadRequestException('Documento inválido');
  }

  if (validateBr.cpf(document)) {
    return {
      cpf: true,
    };
  }

  if (validateBr.cnpj(document)) {
    return {
      cnpj: true,
    };
  }

  throw new BadRequestException('Documento inválido');
};
