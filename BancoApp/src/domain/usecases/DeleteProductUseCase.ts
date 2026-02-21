import { ProductRepository } from '../repositories/ProductRepository';

export class DeleteProductUseCase {
  constructor(private readonly repository: ProductRepository) {}

  execute(id: string): Promise<void> {
    return this.repository.remove(id);
  }
}
