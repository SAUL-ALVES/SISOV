import type { Producer } from '../types/api-contract';
import type { User } from '../types/domain';

export function mapProducerToUser(producer: Producer): User {
  return {
    id: producer.id,
    email: producer.email,
    name: producer.name,
    role: 'producer',
    createdAt: producer.createdAt,
    updatedAt: producer.createdAt,
  };
}
