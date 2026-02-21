import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

interface DeleteModalProps {
  visible: boolean;
  productName: string;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteModal({
  visible,
  productName,
  loading,
  onConfirm,
  onCancel,
}: DeleteModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={onCancel}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.message}>
            ¿Estás seguro de eliminar el producto {productName}?
          </Text>
          <TouchableOpacity
            style={[styles.confirmButton, loading && styles.disabled]}
            onPress={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.confirmText}>Confirmar</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel} disabled={loading}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    paddingBottom: 40,
  },
  closeButton: { alignSelf: 'flex-end', padding: 4, marginBottom: 16 },
  closeText: { fontSize: 18, color: '#666' },
  message: { fontSize: 16, textAlign: 'center', color: '#1A1A2E', marginBottom: 24, lineHeight: 24 },
  confirmButton: {
    backgroundColor: '#FFDD00',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  disabled: { opacity: 0.6 },
  confirmText: { fontSize: 16, fontWeight: '600', color: '#000' },
  cancelButton: { backgroundColor: '#F5F5F5', borderRadius: 8, paddingVertical: 16, alignItems: 'center' },
  cancelText: { fontSize: 16, color: '#1A3C8F', fontWeight: '500' },
});
