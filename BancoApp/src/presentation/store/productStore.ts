import { create } from 'zustand';
import { Product } from '../../domain/entities/Product';
import { GetProductsUseCase } from '../../domain/usecases/GetProductsUseCase';
import { CreateProductUseCase } from '../../domain/usecases/CreateProductUseCase';
import { UpdateProductUseCase } from '../../domain/usecases/UpdateProductUseCase';
import { DeleteProductUseCase } from '../../domain/usecases/DeleteProductUseCase';
import { VerifyProductIdUseCase } from '../../domain/usecases/VerifyProductIdUseCase';
import { ProductRepositoryImpl } from '../../data/repositories/ProductRepositoryImpl';
import { ProductRemoteDataSourceImpl } from '../../data/datasources/ProductRemoteDataSource';

const dataSource = new ProductRemoteDataSourceImpl();
const repository = new ProductRepositoryImpl(dataSource);

const getProductsUseCase = new GetProductsUseCase(repository);
const createProductUseCase = new CreateProductUseCase(repository);
const updateProductUseCase = new UpdateProductUseCase(repository);
const deleteProductUseCase = new DeleteProductUseCase(repository);
const verifyProductIdUseCase = new VerifyProductIdUseCase(repository);

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  createProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string, product: Omit<Product, 'id'>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  verifyProductId: (id: string) => Promise<boolean>;
  clearError: () => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const products = await getProductsUseCase.execute();
      set({ products, loading: false });
    } catch (e: any) {
      set({ error: e.message ?? 'Error al cargar productos', loading: false });
    }
  },

  createProduct: async (product: Product) => {
    set({ loading: true, error: null });
    try {
      await createProductUseCase.execute(product);
      const products = await getProductsUseCase.execute();
      set({ products, loading: false });
    } catch (e: any) {
      set({ error: e.message ?? 'Error al crear producto', loading: false });
      throw e;
    }
  },

  updateProduct: async (id: string, product: Omit<Product, 'id'>) => {
    set({ loading: true, error: null });
    try {
      await updateProductUseCase.execute(id, product);
      const products = await getProductsUseCase.execute();
      set({ products, loading: false });
    } catch (e: any) {
      set({ error: e.message ?? 'Error al actualizar producto', loading: false });
      throw e;
    }
  },

  deleteProduct: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await deleteProductUseCase.execute(id);
      set(state => ({
        products: state.products.filter(p => p.id !== id),
        loading: false,
      }));
    } catch (e: any) {
      set({ error: e.message ?? 'Error al eliminar producto', loading: false });
      throw e;
    }
  },

  verifyProductId: async (id: string) => {
    return verifyProductIdUseCase.execute(id);
  },

  clearError: () => set({ error: null }),
}));
