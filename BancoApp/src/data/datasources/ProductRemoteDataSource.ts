import { Product } from '../../domain/entities/Product';

const BASE_URL = 'http://10.0.2.2:3002/bp/products';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  return response.json();
}

export interface ProductRemoteDataSource {
  getAll(): Promise<{ data: Product[] }>;
  getOne(id: string): Promise<Product>;
  verifyId(id: string): Promise<boolean>;
  create(product: Product): Promise<{ message: string; data: Product }>;
  update(id: string, product: Omit<Product, 'id'>): Promise<{ message: string; data: Product }>;
  remove(id: string): Promise<{ message: string }>;
}

export class ProductRemoteDataSourceImpl implements ProductRemoteDataSource {
  async getAll(): Promise<{ data: Product[] }> {
    const res = await fetch(BASE_URL);
    return handleResponse<{ data: Product[] }>(res);
  }

  async getOne(id: string): Promise<Product> {
    const res = await fetch(`${BASE_URL}/${id}`);
    return handleResponse<Product>(res);
  }

  async verifyId(id: string): Promise<boolean> {
    const res = await fetch(`${BASE_URL}/verification/${id}`);
    return handleResponse<boolean>(res);
  }

  async create(product: Product): Promise<{ message: string; data: Product }> {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    return handleResponse<{ message: string; data: Product }>(res);
  }

  async update(
    id: string,
    product: Omit<Product, 'id'>,
  ): Promise<{ message: string; data: Product }> {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    return handleResponse<{ message: string; data: Product }>(res);
  }

  async remove(id: string): Promise<{ message: string }> {
    const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
    return handleResponse<{ message: string }>(res);
  }
}
