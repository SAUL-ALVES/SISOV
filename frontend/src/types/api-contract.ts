/** Tipos alinhados ao OpenAPI da SISOV API (sisov-api.onrender.com) */

export interface Producer {
  id: string;
  name: string;
  document: string;
  email: string;
  createdAt: string;
}

export interface LoginResponse {
  producer: Producer;
  token: string;
}

export interface RegisterProducerPayload {
  name: string;
  document: string;
  email: string;
  password: string;
}

export interface Property {
  id: string;
  producerId: string;
  farmName: string;
  city: string;
  state: string;
  createdAt: string;
}

export interface CreatePropertyPayload {
  farmName: string;
  city: string;
  state: string;
}

export type AnimalSex = 'MALE' | 'FEMALE';

export type AnimalStatusCode = 'ACTIVE' | 'SOLD' | 'SLAUGHTERED' | 'DEAD';

export interface ApiAnimal {
  sisovId: string;
  tagId: string | null;
  propertyId: string;
  breed: string;
  sex: AnimalSex;
  birthDate: string;
  birthCity: string;
  status: AnimalStatusCode;
  matrixId?: string | null;
  sireId?: string | null;
}

export interface ApiAnimalWithProperty extends ApiAnimal {
  property?: {
    farmName: string;
    city: string;
    state?: string;
  };
}

export interface CreateAnimalPayload {
  tagId?: string;
  propertyId: string;
  breed: string;
  sex: AnimalSex;
  birthDate: string;
  birthCity: string;
  matrixId?: string;
  sireId?: string;
}

export type ManagementEventType =
  | 'VACCINATION'
  | 'VET_TREATMENT'
  | 'WEIGHT_MEASUREMENT'
  | 'NUTRITIONAL_FEEDING'
  | 'REPRODUCTION_COVERAGE'
  | 'SANITARY_DOCUMENT'
  | 'SLAUGHTER_FINALIZATION';

export interface CreateManagementEventPayload {
  eventType: ManagementEventType;
  description?: string;
  eventLocation?: string;
  value?: string;
  occurredAt: string;
}

export interface ManagementEvent {
  id: string;
  animalId: string;
  responsibleId: string;
  eventType: ManagementEventType;
  description?: string | null;
  eventLocation?: string | null;
  occurredAt: string;
}

export interface ApiMessageResponse<T> {
  message: string;
  data: T;
}

export interface ApiErrorBody {
  error?: string;
  message?: string;
  details?: Record<string, string[]>;
}

export interface PublicTraceabilityEvent {
  eventType?: string;
  description?: string | null;
  occurredAt?: string;
  eventLocation?: string | null;
  value?: string | null;
}

export interface PublicTraceabilityData {
  animal?: ApiAnimalWithProperty;
  producer?: { name?: string };
  property?: { farmName?: string; city?: string; state?: string };
  events?: PublicTraceabilityEvent[];
  movements?: unknown[];
  hasIG?: boolean;
  seal?: string;
  origin?: string;
  [key: string]: unknown;
}

export interface AnimalFullHistory {
  animal?: ApiAnimalWithProperty;
  events?: ManagementEvent[];
  movements?: unknown[];
  [key: string]: unknown;
}
