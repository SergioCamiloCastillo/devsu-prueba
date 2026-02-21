import { ProductRepositoryImpl } from '../data/repositories/ProductRepositoryImpl';
import { ProductRemoteDataSource } from '../data/datasources/ProductRemoteDataSource';

const mockProduct = {
  id: 'abc',
  name: 'Test Product',
  description: 'A test description',
  logo: 'https://example.com/logo.png',
  date_release: '2099-01-01',
  date_revision: '2100-01-01',
};

const mockDataSource: jest.Mocked<ProductRemoteDataSource> = {
  getAll: jest.fn(),
  getOne: jest.fn(),
  verifyId: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const repository = new ProductRepositoryImpl(mockDataSource);

beforeEach(() => jest.clearAllMocks());

describe('ProductRepositoryImpl.getAll', () => {
  it('returns the data array from datasource', async () => {
    mockDataSource.getAll.mockResolvedValueOnce({ data: [mockProduct] });
    const result = await repository.getAll();
    expect(result).toEqual([mockProduct]);
    expect(mockDataSource.getAll).toHaveBeenCalledTimes(1);
  });
});

describe('ProductRepositoryImpl.getOne', () => {
  it('returns a single product', async () => {
    mockDataSource.getOne.mockResolvedValueOnce(mockProduct);
    const result = await repository.getOne('abc');
    expect(result).toEqual(mockProduct);
    expect(mockDataSource.getOne).toHaveBeenCalledWith('abc');
  });
});

describe('ProductRepositoryImpl.verifyId', () => {
  it('returns true when id exists', async () => {
    mockDataSource.verifyId.mockResolvedValueOnce(true);
    expect(await repository.verifyId('abc')).toBe(true);
  });

  it('returns false when id does not exist', async () => {
    mockDataSource.verifyId.mockResolvedValueOnce(false);
    expect(await repository.verifyId('xyz')).toBe(false);
  });
});

describe('ProductRepositoryImpl.create', () => {
  it('returns the created product data', async () => {
    mockDataSource.create.mockResolvedValueOnce({ message: 'ok', data: mockProduct });
    const result = await repository.create(mockProduct);
    expect(result).toEqual(mockProduct);
    expect(mockDataSource.create).toHaveBeenCalledWith(mockProduct);
  });

  it('throws on datasource error', async () => {
    mockDataSource.create.mockRejectedValueOnce(new Error('Duplicate'));
    await expect(repository.create(mockProduct)).rejects.toThrow('Duplicate');
  });
});

describe('ProductRepositoryImpl.update', () => {
  const payload = { name: 'Updated', description: 'desc', logo: 'url', date_release: '2099-01-01', date_revision: '2100-01-01' };

  it('returns the updated product data', async () => {
    const updated = { id: 'abc', ...payload };
    mockDataSource.update.mockResolvedValueOnce({ message: 'ok', data: updated });
    const result = await repository.update('abc', payload);
    expect(result).toEqual(updated);
    expect(mockDataSource.update).toHaveBeenCalledWith('abc', payload);
  });

  it('throws on datasource error', async () => {
    mockDataSource.update.mockRejectedValueOnce(new Error('Not found'));
    await expect(repository.update('abc', payload)).rejects.toThrow('Not found');
  });
});

describe('ProductRepositoryImpl.remove', () => {
  it('resolves without value on success', async () => {
    mockDataSource.remove.mockResolvedValueOnce({ message: 'ok' });
    await expect(repository.remove('abc')).resolves.toBeUndefined();
    expect(mockDataSource.remove).toHaveBeenCalledWith('abc');
  });

  it('throws on datasource error', async () => {
    mockDataSource.remove.mockRejectedValueOnce(new Error('Not found'));
    await expect(repository.remove('abc')).rejects.toThrow('Not found');
  });
});
