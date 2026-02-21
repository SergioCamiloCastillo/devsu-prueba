import { Product } from '../entities/Product';
import { ProductRepository } from '../repositories/ProductRepository';

export class GetProductsUseCase {
  constructor(private readonly repository: ProductRepository) {}

  execute(): Promise<Product[]> {
    return this.repository.getAll();
  }
}
