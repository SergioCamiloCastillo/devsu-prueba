import { Product } from '../entities/Product';
import { ProductRepository } from '../repositories/ProductRepository';

export class CreateProductUseCase {
  constructor(private readonly repository: ProductRepository) {}

  execute(product: Product): Promise<Product> {
    return this.repository.create(product);
  }
}
