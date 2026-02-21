import { Product } from '../entities/Product';
import { ProductRepository } from '../repositories/ProductRepository';

export class UpdateProductUseCase {
  constructor(private readonly repository: ProductRepository) {}

  execute(id: string, product: Omit<Product, 'id'>): Promise<Product> {
    return this.repository.update(id, product);
  }
}
