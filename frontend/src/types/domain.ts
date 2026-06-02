// User and Auth types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'producer' | 'admin' | 'consumer';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Animal types
export const AnimalStatus = {
  HEALTHY: 'Saudável',
  PENDING_VACCINATION: 'Vacinação Pendente',
  QUARANTINE: 'Quarentena',
  SLAUGHTERED: 'Abatido',
} as const;

export type AnimalStatus = typeof AnimalStatus[keyof typeof AnimalStatus];

export const AnimalType = {
  OVINE: 'Ovino',
  CAPRINE: 'Caprino',
} as const;

export type AnimalType = typeof AnimalType[keyof typeof AnimalType];

export interface Animal {
  id: string;
  individualId: string;
  name: string;
  type: AnimalType;
  race: string;
  weight: string;  // mantém como string para compatibilidade com componentes existentes
  birthDate: string;
  status: AnimalStatus;
  location: string;
  lastCheck: string;
  image: string;
  trackingCode: string;
  producerId: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateAnimalDTO = Omit<Animal, 'id' | 'trackingCode' | 'createdAt' | 'updatedAt' | 'producerId'>;
export type UpdateAnimalDTO = Partial<CreateAnimalDTO>;

// Paginated response
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

// API Error
export interface ApiError {
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
  timestamp: string;
}

// QR Code
export interface QrCodeResponse {
  qrCode: string;
  trackingUrl: string;
  animalId: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalAnimals: number;
  healthyAnimals: number;
  pendingVaccinations: number;
  averageWeight: number;
  recentAnimals: Animal[];
}
