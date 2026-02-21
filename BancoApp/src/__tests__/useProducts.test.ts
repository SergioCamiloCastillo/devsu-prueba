const mockGetAll = jest.fn();
const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockRemove = jest.fn();
const mockVerifyId = jest.fn();
const mockGetOne = jest.fn();

jest.mock('../data/datasources/ProductRemoteDataSource', () => {
  const instance = {
    getAll: mockGetAll,
    create: mockCreate,
    update: mockUpdate,
    remove: mockRemove,
    verifyId: mockVerifyId,
    getOne: mockGetOne,
  };
  return {
    ProductRemoteDataSourceImpl: jest.fn().mockImplementation(() => instance),
    __instance: instance,
  };
});

jest.mock('@tanstack/react-query', () => {
  const actual = jest.requireActual('@tanstack/react-query');
  return {
    ...actual,
    useQuery: jest.fn(),
    useMutation: jest.fn(),
    useQueryClient: jest.fn(),
  };
});

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useVerifyProductId,
  PRODUCTS_QUERY_KEY,
} from '../presentation/hooks/useProducts';

const mockInvalidate = jest.fn();
(useQueryClient as jest.Mock).mockReturnValue({ invalidateQueries: mockInvalidate });

const mockProduct = {
  id: 'abc',
  name: 'Test',
  description: 'Description here',
  logo: 'https://example.com/logo.png',
  date_release: '2099-01-01',
  date_revision: '2100-01-01',
};

beforeEach(() => jest.clearAllMocks());

describe('useProducts', () => {
  it('calls useQuery with correct queryKey and queryFn', () => {
    (useQuery as jest.Mock).mockReturnValue({ data: [mockProduct], isLoading: false });
    mockGetAll.mockResolvedValueOnce({ data: [mockProduct] });

    const result = useProducts();

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: PRODUCTS_QUERY_KEY }),
    );
    expect(result.data).toEqual([mockProduct]);
  });
});

describe('useCreateProduct', () => {
  it('calls useMutation and invalidates on success', async () => {
    (useMutation as jest.Mock).mockImplementation(({ onSuccess }) => {
      onSuccess?.();
      return { mutateAsync: jest.fn() };
    });

    useCreateProduct();

    expect(useMutation).toHaveBeenCalled();
    expect(mockInvalidate).toHaveBeenCalledWith({ queryKey: PRODUCTS_QUERY_KEY });
  });
});

describe('useUpdateProduct', () => {
  it('calls useMutation and invalidates on success', () => {
    (useMutation as jest.Mock).mockImplementation(({ onSuccess }) => {
      onSuccess?.();
      return { mutateAsync: jest.fn() };
    });

    useUpdateProduct();

    expect(useMutation).toHaveBeenCalled();
    expect(mockInvalidate).toHaveBeenCalledWith({ queryKey: PRODUCTS_QUERY_KEY });
  });
});

describe('useDeleteProduct', () => {
  it('calls useMutation and invalidates on success', () => {
    (useMutation as jest.Mock).mockImplementation(({ onSuccess }) => {
      onSuccess?.();
      return { mutateAsync: jest.fn() };
    });

    useDeleteProduct();

    expect(useMutation).toHaveBeenCalled();
    expect(mockInvalidate).toHaveBeenCalledWith({ queryKey: PRODUCTS_QUERY_KEY });
  });
});

describe('useVerifyProductId', () => {
  it('calls useMutation with verifyId fn', () => {
    (useMutation as jest.Mock).mockReturnValue({ mutateAsync: jest.fn() });

    useVerifyProductId();

    expect(useMutation).toHaveBeenCalled();
  });
});
