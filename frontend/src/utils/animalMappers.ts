import type { ApiAnimal, ApiAnimalWithProperty, AnimalStatusCode } from '../types/api-contract';
import { AnimalStatus, type Animal } from '../types/domain';

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1616842609926-533364126cf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';

const STATUS_LABELS: Record<AnimalStatusCode, AnimalStatus> = {
  ACTIVE: AnimalStatus.HEALTHY,
  SOLD: AnimalStatus.QUARANTINE,
  SLAUGHTERED: AnimalStatus.SLAUGHTERED,
  DEAD: AnimalStatus.QUARANTINE,
};

function formatDisplayDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString('pt-BR');
}

export function mapApiAnimalToUi(animal: ApiAnimal | ApiAnimalWithProperty): Animal {
  const label = animal.tagId ?? animal.sisovId.slice(0, 8).toUpperCase();
  const withProperty = animal as ApiAnimalWithProperty;

  return {
    id: animal.sisovId,
    individualId: animal.tagId ?? animal.sisovId,
    name: animal.tagId ? `Animal ${animal.tagId}` : `Animal ${label}`,
    type: 'Ovino',
    race: animal.breed,
    weight: '—',
    birthDate: formatDisplayDate(animal.birthDate),
    status: STATUS_LABELS[animal.status] ?? AnimalStatus.HEALTHY,
    location: withProperty.property?.farmName ?? animal.birthCity,
    lastCheck: formatDisplayDate(animal.birthDate),
    image: DEFAULT_IMAGE,
    trackingCode: animal.sisovId,
    producerId: '',
    createdAt: animal.birthDate,
    updatedAt: animal.birthDate,
    sisovId: animal.sisovId,
    tagId: animal.tagId,
    sex: animal.sex,
    birthCity: animal.birthCity,
    propertyId: animal.propertyId,
    apiStatus: animal.status,
  };
}

export { DEFAULT_IMAGE };
