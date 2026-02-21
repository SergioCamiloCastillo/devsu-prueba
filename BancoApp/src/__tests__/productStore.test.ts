jest.mock('../data/datasources/ProductRemoteDataSource', () => {
  const instance = {
    getAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    verifyId: jest.fn(),
    getOne: jest.fn(),
  };
  return {
    ProductRemoteDataSourceImpl: jest.fn().mockImplementation(() => instance),
    __instance: instance,
  };
});

import { useProductStore } from '../presentation/store/productStore';
import * as DSModule from '../data/datasources/ProductRemoteDataSource';

interface MockDS {
  getAll: jest.Mock;
  create: jest.Mock;
  update: jest.Mock;
  remove: jest.Mock;
  verifyId: jest.Mock;
  getOne: jest.Mock;
}
const mockDS = (DSModule as any).__instance as MockDS;

const mockProduct = {
  id: 'abc',
  name: 'Test Product',
  description: 'A test description',
  logo: 'https://example.com/logo.png',
  date_release: '2099-01-01',
  date_revision: '2100-01-01',
};

beforeEach(() => {
  jest.clearAllMocks();
  useProductStore.setState({ products: [], loading: false, error: null });
});

describe('useProductStore.fetchProducts', () => {
  it('sets products on success', async () => {
    mockDS.getAll.mockResolvedValueOnce({ data: [mockProduct] });
    await useProductStore.getState().fetchProducts();
    expect(useProductStore.getState().products).toEqual([mockProduct]);
    expect(useProductStore.getState().loading).toBe(false);
    expect(useProductStore.getState().error).toBeNull();
  });

  it('sets error on failure', async () => {
    mockDS.getAll.mockRejectedValueOnce(new Error('Network error'));
    await useProductStore.getState().fetchProducts();
    expect(useProductStore.getState().error).toBe('Network error');
    expect(useProductStore.getState().loading).toBe(false);
  });
});

describe('useProductStore.createProduct', () => {
  it('creates product and refreshes list', async () => {
    mockDS.create.mockResolvedValueOnce({ message: 'ok', data: mockProduct });
    mockDS.getAll.mockResolvedValueOnce({ data: [mockProduct] });
    await useProductStore.getState().createProduct(mockProduct);
    expect(useProductStore.getState().products).toEqual([mockProduct]);
  });

  it('sets error and rethrows on failure', async () => {
    mockDS.create.mockRejectedValueOnce(new Error('Duplicate'));
    await expect(useProductStore.getState().createProduct(mockProduct)).rejects.toThrow('Duplicate');
    expect(useProductStore.getState().error).toBe('Duplicate');
  });
});

describe('useProductStore.updateProduct', () => {
  it('updates product and refreshes list', async () => {
    const updated = { ...mockProduct, name: 'Updated' };
    mockDS.update.mockResolvedValueOnce({ message: 'ok', data: updated });
    mockDS.getAll.mockResolvedValueOnce({ data: [updated] });
    await useProductStore.getState().updateProduct('abc', { name: 'Updated', description: 'A test description', logo: 'https://example.com/logo.png', date_release: '2099-01-01', date_revision: '2100-01-01' });
    expect(useProductStore.getState().products[0].name).toBe('Updated');
  });

  it('sets error and rethrows on failure', async () => {
    mockDS.update.mockRejectedValueOnce(new Error('Not found'));
    await expect(useProductStore.getState().updateProduct('abc', { name: 'x', description: 'y', logo: 'z', date_release: '2099-01-01', date_revision: '2100-01-01' })).rejects.toThrow('Not found');
    expect(useProductStore.getState().error).toBe('Not found');
  });
});

describe('useProductStore.deleteProduct', () => {
  it('removes product from state on success', async () => {
    useProductStore.setState({ products: [mockProduct] });
    mockDS.remove.mockResolvedValueOnce({ message: 'ok' });
    await useProductStore.getState().deleteProduct('abc');
    expect(useProductStore.getState().products).toHaveLength(0);
  });

  it('sets error and rethrows on failure', async () => {
    mockDS.remove.mockRejectedValueOnce(new Error('Not found'));
    await expect(useProductStore.getState().deleteProduct('abc')).rejects.toThrow('Not found');
    expect(useProductStore.getState().error).toBe('Not found');
  });
});

describe('useProductStore.verifyProductId', () => {
  it('returns true when id exists', async () => {
    mockDS.verifyId.mockResolvedValueOnce(true);
    const result = await useProductStore.getState().verifyProductId('abc');
    expect(result).toBe(true);
  });

  it('returns false when id does not exist', async () => {
    mockDS.verifyId.mockResolvedValueOnce(false);
    const result = await useProductStore.getState().verifyProductId('xyz');
    expect(result).toBe(false);
  });
});

describe('useProductStore.clearError', () => {
  it('clears the error state', () => {
    useProductStore.setState({ error: 'some error' });
    useProductStore.getState().clearError();
    expect(useProductStore.getState().error).toBeNull();
  });
});
