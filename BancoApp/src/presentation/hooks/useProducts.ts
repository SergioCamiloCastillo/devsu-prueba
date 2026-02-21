import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product } from '../../domain/entities/Product';
import { ProductRepositoryImpl } from '../../data/repositories/ProductRepositoryImpl';
import { ProductRemoteDataSourceImpl } from '../../data/datasources/ProductRemoteDataSource';
import { GetProductsUseCase } from '../../domain/usecases/GetProductsUseCase';
import { CreateProductUseCase } from '../../domain/usecases/CreateProductUseCase';
import { UpdateProductUseCase } from '../../domain/usecases/UpdateProductUseCase';
import { DeleteProductUseCase } from '../../domain/usecases/DeleteProductUseCase';
import { VerifyProductIdUseCase } from '../../domain/usecases/VerifyProductIdUseCase';

const dataSource = new ProductRemoteDataSourceImpl();
const repository = new ProductRepositoryImpl(dataSource);

const getProductsUseCase = new GetProductsUseCase(repository);
const createProductUseCase = new CreateProductUseCase(repository);
const updateProductUseCase = new UpdateProductUseCase(repository);
const deleteProductUseCase = new DeleteProductUseCase(repository);
const verifyProductIdUseCase = new VerifyProductIdUseCase(repository);

export const PRODUCTS_QUERY_KEY = ['products'] as const;

export function useProducts() {
  return useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: () => getProductsUseCase.execute(),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (product: Product) => createProductUseCase.execute(product),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY }),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, product }: { id: string; product: Omit<Product, 'id'> }) =>
      updateProductUseCase.execute(id, product),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY }),
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProductUseCase.execute(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY }),
  });
}

export function useVerifyProductId() {
  return useMutation({
    mutationFn: (id: string) => verifyProductIdUseCase.execute(id),
  });
}
