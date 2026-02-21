import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useDeleteProduct } from '../hooks/useProducts';
import DeleteModal from '../components/DeleteModal';
import Header from '../components/Header';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ProductDetail'>;
  route: RouteProp<RootStackParamList, 'ProductDetail'>;
};

export default function ProductDetailScreen({ navigation, route }: Props) {
  const { product } = route.params;
  const deleteProduct = useDeleteProduct();
  const [modalVisible, setModalVisible] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteProduct.mutateAsync(product.id);
      setModalVisible(false);
      navigation.navigate('ProductList');
    } catch {
      Alert.alert('Error', 'No se pudo eliminar el producto');
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.productId}>ID: {product.id}</Text>
        <Text style={styles.extraInfo}>Información extra</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Nombre</Text>
          <Text style={styles.value}>{product.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Descripción</Text>
          <Text style={styles.value}>{product.description}</Text>
        </View>
        <View style={styles.logoRow}>
          <Text style={styles.label}>Logo</Text>
          <Image source={{ uri: product.logo }} style={styles.logo} resizeMode="contain" />
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Fecha liberación</Text>
          <Text style={styles.value}>{product.date_release}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Fecha revisión</Text>
          <Text style={styles.value}>{product.date_revision}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('ProductForm', { product, isEdit: true })}
          testID="edit-button"
        >
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => setModalVisible(true)}
          testID="delete-button"
        >
          <Text style={styles.deleteButtonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>

      <DeleteModal
        visible={modalVisible}
        productName={product.name}
        loading={deleteProduct.isPending}
        onConfirm={handleDelete}
        onCancel={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { flex: 1 },
  scrollContent: { padding: 20 },
  productId: { fontSize: 22, fontWeight: 'bold', color: '#1A1A2E', marginBottom: 4 },
  extraInfo: { fontSize: 13, color: '#999', marginBottom: 24 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  logoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  label: { fontSize: 14, color: '#666', flex: 1 },
  value: { fontSize: 14, color: '#1A1A2E', fontWeight: '500', flex: 1, textAlign: 'right' },
  logo: { width: 120, height: 80, backgroundColor: '#FFDD00', borderRadius: 8 },
  footer: { padding: 16, gap: 12 },
  editButton: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  editButtonText: { fontSize: 16, color: '#1A3C8F', fontWeight: '500' },
  deleteButton: {
    backgroundColor: '#CC0000',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  deleteButtonText: { fontSize: 16, color: '#FFFFFF', fontWeight: '600' },
});
