import { z } from 'zod';

function hasRepeatedDigits(value: string): boolean {
  return value.split('').every((digit) => digit === value[0]);
}

function isValidCpf(cpf: string): boolean {
  if (cpf.length !== 11 || hasRepeatedDigits(cpf)) return false;

  const calculateDigit = (length: number, factor: number) => {
    let sum = 0;
    for (let index = 0; index < length; index += 1) {
      sum += Number(cpf[index]) * (factor - index);
    }
    const digit = 11 - (sum % 11);
    return digit > 9 ? 0 : digit;
  };

  return (
    Number(cpf[9]) === calculateDigit(9, 10) &&
    Number(cpf[10]) === calculateDigit(10, 11)
  );
}

function isValidCnpj(cnpj: string): boolean {
  if (cnpj.length !== 14 || hasRepeatedDigits(cnpj)) return false;

  const calculateDigit = (base: string, weights: number[]) => {
    const sum = weights.reduce(
      (total, weight, index) => total + Number(base[index]) * weight,
      0,
    );
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const base = cnpj.slice(0, 12);
  const first = calculateDigit(base, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const second = calculateDigit(
    `${base}${first}`,
    [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
  );
  return cnpj.endsWith(`${first}${second}`);
}

export const documentSchema = z
  .string()
  .transform((value) => value.replace(/\D/g, ''))
  .refine(
    (value) => isValidCpf(value) || isValidCnpj(value),
    'Informe um CPF ou CNPJ válido',
  );

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  document: documentSchema,
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const animalSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  individualId: z.string().min(1, 'ID do animal é obrigatório'),
  type: z.enum(['Ovino', 'Caprino']),
  race: z.string().min(1, 'Raça é obrigatória'),
  weight: z.string().regex(/^\d+(\.\d{1,2})?/, 'Peso deve ser um número válido'),
  birthDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Data inválida'),
  status: z.enum(['Saudável', 'Vacinação Pendente', 'Quarentena', 'Abatido']),
  location: z.string().min(1, 'Localização é obrigatória'),
  image: z.string().optional(),
});

export type AnimalFormData = z.infer<typeof animalSchema>;
