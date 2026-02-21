import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Product } from '../../domain/entities/Product';
import { useProducts } from '../hooks/useProducts';
import { ProductListSkeleton } from '../components/SkeletonLoader';
import Header from '../components/Header';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ProductList'>;
};

export default function ProductListScreen({ navigation }: Props) {
  const { data: products = [], isLoading: loading, error, refetch } = useProducts();
  const [search, setSearch] = useState('');

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  if (error) {
    Alert.alert('Error', error.message ?? 'Error al cargar productos');
  }

  const filtered = products.filter(
    p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()),
  );

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
      testID={`product-item-${item.id}`}
    >
      <View style={styles.listItemContent}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemId}>ID: {item.id}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
          testID="search-input"
        />
      </View>

      {loading ? (
        <ProductListSkeleton />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No se encontraron productos</Text>
          }
        />
      )}

      <View style={styles.footer}>
        <Text style={styles.countText}>{filtered.length} Resultados</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('ProductForm', { isEdit: false })}
          testID="add-button"
        >
          <Text style={styles.addButtonText}>Agregar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  searchContainer: { paddingHorizontal: 16, paddingVertical: 12 },
  searchInput: {
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1A1A2E',
    backgroundColor: '#FAFAFA',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  listItemContent: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: '600', color: '#1A1A2E' },
  itemId: { fontSize: 13, color: '#666', marginTop: 2 },
  chevron: { fontSize: 22, color: '#999' },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 40, fontSize: 15 },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  countText: { fontSize: 13, color: '#666', marginBottom: 12, textAlign: 'center' },
  addButton: { backgroundColor: '#FFDD00', borderRadius: 8, paddingVertical: 16, alignItems: 'center' },
  addButtonText: { fontSize: 16, fontWeight: '600', color: '#000' },
});
