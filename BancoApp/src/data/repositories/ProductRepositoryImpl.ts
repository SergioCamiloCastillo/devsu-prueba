import { Product } from '../../domain/entities/Product';
import { ProductRepository } from '../../domain/repositories/ProductRepository';
import { ProductRemoteDataSource } from '../datasources/ProductRemoteDataSource';

export class ProductRepositoryImpl implements ProductRepository {
  constructor(private readonly dataSource: ProductRemoteDataSource) {}

  async getAll(): Promise<Product[]> {
    const response = await this.dataSource.getAll();
    return response.data;
  }

  async getOne(id: string): Promise<Product> {
    return this.dataSource.getOne(id);
  }

  async verifyId(id: string): Promise<boolean> {
    return this.dataSource.verifyId(id);
  }

  async create(product: Product): Promise<Product> {
    const response = await this.dataSource.create(product);
    return response.data;
  }

  async update(id: string, product: Omit<Product, 'id'>): Promise<Product> {
    const response = await this.dataSource.update(id, product);
    return response.data;
  }

  async remove(id: string): Promise<void> {
    await this.dataSource.remove(id);
  }
}
