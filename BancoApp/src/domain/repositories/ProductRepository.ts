import { Product } from '../entities/Product';

export interface ProductRepository {
  getAll(): Promise<Product[]>;
  getOne(id: string): Promise<Product>;
  verifyId(id: string): Promise<boolean>;
  create(product: Product): Promise<Product>;
  update(id: string, product: Omit<Product, 'id'>): Promise<Product>;
  remove(id: string): Promise<void>;
}
