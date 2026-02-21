import { Product } from '../entities/Product';
import { ProductRepository } from '../repositories/ProductRepository';

export class GetProductUseCase {
  constructor(private readonly repository: ProductRepository) {}

  execute(id: string): Promise<Product> {
    return this.repository.getOne(id);
  }
}
