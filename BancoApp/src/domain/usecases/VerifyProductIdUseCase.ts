import { ProductRepository } from '../repositories/ProductRepository';

export class VerifyProductIdUseCase {
  constructor(private readonly repository: ProductRepository) {}

  execute(id: string): Promise<boolean> {
    return this.repository.verifyId(id);
  }
}
