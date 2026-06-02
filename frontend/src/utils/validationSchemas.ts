import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

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
