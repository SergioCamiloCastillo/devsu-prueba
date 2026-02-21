import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Product } from '../../domain/entities/Product';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import ProductFormScreen from '../screens/ProductFormScreen';

export type RootStackParamList = {
  ProductList: undefined;
  ProductDetail: { product: Product };
  ProductForm: { product?: Product; isEdit?: boolean };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="ProductList"
        screenOptions={{
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerTintColor: '#1A1A2E',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen
          name="ProductList"
          component={ProductListScreen}
          options={{ title: 'Productos Financieros' }}
        />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={{ title: 'Detalle del Producto' }}
        />
        <Stack.Screen
          name="ProductForm"
          component={ProductFormScreen}
          options={({ route }: { route: { params?: { isEdit?: boolean } } }) => ({
            title: route.params?.isEdit ? 'Editar Producto' : 'Formulario de Registro',
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
