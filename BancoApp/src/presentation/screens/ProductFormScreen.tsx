import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  ActionSheetIOS,
  Platform,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useCreateProduct, useUpdateProduct, useVerifyProductId } from '../hooks/useProducts';
import { validateForm, validateId, addOneYear, isValidDateStr } from '../../utils/validation';
import { FormErrors } from '../../domain/entities/FormErrors';
import Header from '../components/Header';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ProductForm'>;
  route: RouteProp<RootStackParamList, 'ProductForm'>;
};

interface FormState {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string;
  date_revision: string;
}

const EMPTY_FORM: FormState = {
  id: '',
  name: '',
  description: '',
  logo: '',
  date_release: '',
  date_revision: '',
};

export default function ProductFormScreen({ navigation, route }: Props) {
  const isEdit = route.params?.isEdit ?? false;
  const existingProduct = route.params?.product;

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const verifyId = useVerifyProductId();

  const [form, setForm] = useState<FormState>(
    isEdit && existingProduct
      ? {
          id: existingProduct.id,
          name: existingProduct.name,
          description: existingProduct.description,
          logo: existingProduct.logo,
          date_release: existingProduct.date_release,
          date_revision: existingProduct.date_revision,
        }
      : EMPTY_FORM,
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [idChecking, setIdChecking] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const loading = createProduct.isPending || updateProduct.isPending;

  useEffect(() => {
    if (isValidDateStr(form.date_release)) {
      const computed = addOneYear(form.date_release);
      if (computed) {
        setForm((prev: FormState) => ({ ...prev, date_revision: computed }));
      }
    } else {
      setForm((prev: FormState) => ({ ...prev, date_revision: '' }));
    }
  }, [form.date_release]);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev: FormState) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: FormErrors) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleDateChange = (_event: DateTimePickerEvent, selected?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selected) {
      const iso = selected.toISOString().split('T')[0];
      handleChange('date_release', iso);
    }
  };

  const handlePickLogo = () => {
    const options = ['Tomar fotografía', 'Elegir de galería', 'Cancelar'];
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        { options, cancelButtonIndex: 2 },
        idx => {
          if (idx === 0) openCamera();
          if (idx === 1) openGallery();
        },
      );
    } else {
      Alert.alert('Logo', 'Selecciona una opción', [
        { text: 'Tomar fotografía', onPress: openCamera },
        { text: 'Elegir de galería', onPress: openGallery },
        { text: 'Cancelar', style: 'cancel' },
      ]);
    }
  };

  const openCamera = () => {
    launchCamera({ mediaType: 'photo', quality: 0.7 }, response => {
      if (response.assets?.[0]?.uri) {
        handleChange('logo', response.assets[0].uri);
      }
    });
  };

  const openGallery = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, response => {
      if (response.assets?.[0]?.uri) {
        handleChange('logo', response.assets[0].uri);
      }
    });
  };

  const handleIdBlur = async () => {
    if (isEdit) return;
    const idError = validateId(form.id);
    if (idError) {
      setErrors((prev: FormErrors) => ({ ...prev, id: idError }));
      return;
    }
    setIdChecking(true);
    try {
      const exists = await verifyId.mutateAsync(form.id);
      setErrors((prev: FormErrors) => ({
        ...prev,
        id: exists ? 'ID no válido! Ya existe un producto con este ID' : undefined,
      }));
    } catch {
      // ignore on blur
    } finally {
      setIdChecking(false);
    }
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm(form, isEdit);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    if (!isEdit) {
      setIdChecking(true);
      try {
        const exists = await verifyId.mutateAsync(form.id);
        if (exists) {
          setErrors({ id: 'ID no válido! Ya existe un producto con este ID' });
          setIdChecking(false);
          return;
        }
      } catch {
        Alert.alert('Error', 'No se pudo verificar el ID');
        setIdChecking(false);
        return;
      }
      setIdChecking(false);
    }
    try {
      if (isEdit && existingProduct) {
        await updateProduct.mutateAsync({
          id: existingProduct.id,
          product: {
            name: form.name,
            description: form.description,
            logo: form.logo,
            date_release: form.date_release,
            date_revision: form.date_revision,
          },
        });
        Alert.alert('Éxito', 'Producto actualizado correctamente', [
          { text: 'OK', onPress: () => navigation.navigate('ProductList') },
        ]);
      } else {
        await createProduct.mutateAsync({
          id: form.id,
          name: form.name,
          description: form.description,
          logo: form.logo,
          date_release: form.date_release,
          date_revision: form.date_revision,
        });
        Alert.alert('Éxito', 'Producto creado correctamente', [
          { text: 'OK', onPress: () => navigation.navigate('ProductList') },
        ]);
      }
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Ocurrió un error al guardar el producto');
    }
  };

  const handleReset = () => {
    setForm(
      isEdit && existingProduct
        ? {
            id: existingProduct.id,
            name: existingProduct.name,
            description: existingProduct.description,
            logo: existingProduct.logo,
            date_release: existingProduct.date_release,
            date_revision: existingProduct.date_revision,
          }
        : EMPTY_FORM,
    );
    setErrors({});
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.formTitle}>Formulario de Registro</Text>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>ID</Text>
          <TextInput
            style={[styles.input, errors.id ? styles.inputError : null]}
            value={form.id}
            onChangeText={v => handleChange('id', v)}
            onBlur={handleIdBlur}
            editable={!isEdit}
            testID="input-id"
          />
          {idChecking && <ActivityIndicator size="small" color="#1A3C8F" style={styles.checking} />}
          {errors.id ? <Text style={styles.errorText}>{errors.id}</Text> : null}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={[styles.input, errors.name ? styles.inputError : null]}
            value={form.name}
            onChangeText={v => handleChange('name', v)}
            testID="input-name"
          />
          {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, errors.description ? styles.inputError : null]}
            value={form.description}
            onChangeText={v => handleChange('description', v)}
            multiline
            testID="input-description"
          />
          {errors.description ? <Text style={styles.errorText}>{errors.description}</Text> : null}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Logo</Text>
          <TouchableOpacity
            style={[styles.logoPickerButton, errors.logo ? styles.inputError : null]}
            onPress={handlePickLogo}
            testID="input-logo"
          >
            {form.logo ? (
              <Image source={{ uri: form.logo }} style={styles.logoPreview} resizeMode="cover" />
            ) : (
              <Text style={styles.logoPickerText}>📷  Tomar foto o elegir imagen</Text>
            )}
          </TouchableOpacity>
          {errors.logo ? <Text style={styles.errorText}>{errors.logo}</Text> : null}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Fecha Liberación</Text>
          <TouchableOpacity
            style={[styles.input, styles.dateButton, errors.date_release ? styles.inputError : null]}
            onPress={() => setShowDatePicker(true)}
            testID="input-date-release"
          >
            <Text style={form.date_release ? styles.dateText : styles.datePlaceholder}>
              {form.date_release || 'Seleccionar fecha'}
            </Text>
            <Text style={styles.calendarIcon}>📅</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={form.date_release ? new Date(form.date_release) : new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              minimumDate={new Date()}
              onChange={handleDateChange}
            />
          )}
          {errors.date_release ? <Text style={styles.errorText}>{errors.date_release}</Text> : null}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Fecha Revisión</Text>
          <View style={[styles.input, styles.inputDisabledView]}>
            <Text style={form.date_revision ? styles.dateText : styles.datePlaceholder}>
              {form.date_revision || 'Se calcula automáticamente'}
            </Text>
          </View>
          {errors.date_revision ? <Text style={styles.errorText}>{errors.date_revision}</Text> : null}
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.disabled]}
          onPress={handleSubmit}
          disabled={loading}
          testID="submit-button"
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.submitButtonText}>Enviar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleReset}
          disabled={loading}
          testID="reset-button"
        >
          <Text style={styles.resetButtonText}>Reiniciar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  formTitle: { fontSize: 22, fontWeight: 'bold', color: '#1A1A2E', marginBottom: 24 },
  fieldContainer: { marginBottom: 16 },
  label: { fontSize: 14, color: '#1A1A2E', marginBottom: 6, fontWeight: '500' },
  input: {
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1A1A2E',
    backgroundColor: '#FFFFFF',
  },
  inputError: { borderColor: '#CC0000', borderWidth: 2 },
  inputDisabled: { backgroundColor: '#F5F5F5', color: '#999' },
  inputDisabledView: { backgroundColor: '#F5F5F5', justifyContent: 'center' as const },
  errorText: { color: '#CC0000', fontSize: 12, marginTop: 4 },
  checking: { marginTop: 4 },
  logoPickerButton: {
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 6,
    height: 120,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: '#FAFAFA',
    overflow: 'hidden' as const,
  },
  logoPreview: { width: '100%', height: '100%' },
  logoPickerText: { fontSize: 14, color: '#666' },
  dateButton: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  dateText: { fontSize: 14, color: '#1A1A2E' },
  datePlaceholder: { fontSize: 14, color: '#999' },
  calendarIcon: { fontSize: 18 },
  submitButton: {
    backgroundColor: '#FFDD00',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  disabled: { opacity: 0.6 },
  submitButtonText: { fontSize: 16, fontWeight: '600', color: '#000' },
  resetButton: { backgroundColor: '#F5F5F5', borderRadius: 8, paddingVertical: 16, alignItems: 'center' },
  resetButtonText: { fontSize: 16, color: '#1A3C8F', fontWeight: '500' },
});
