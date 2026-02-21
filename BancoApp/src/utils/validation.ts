import { FormErrors } from '../domain/entities/FormErrors';

export function formatDateToISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function isValidDateStr(dateStr: string): boolean {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

export function addOneYear(dateStr: string): string {
  if (!isValidDateStr(dateStr)) return '';
  const date = new Date(dateStr);
  date.setFullYear(date.getFullYear() + 1);
  return formatDateToISO(date);
}

export function getTodayISO(): string {
  return formatDateToISO(new Date());
}

export function validateId(value: string): string | undefined {
  if (!value || value.trim().length === 0) return 'ID es requerido';
  if (value.length < 3) return 'Mínimo 3 caracteres';
  if (value.length > 10) return 'Máximo 10 caracteres';
  return undefined;
}

export function validateName(value: string): string | undefined {
  if (!value || value.trim().length === 0) return 'Nombre es requerido';
  if (value.length < 5) return 'Mínimo 5 caracteres';
  if (value.length > 100) return 'Máximo 100 caracteres';
  return undefined;
}

export function validateDescription(value: string): string | undefined {
  if (!value || value.trim().length === 0) return 'Descripción es requerida';
  if (value.length < 10) return 'Mínimo 10 caracteres';
  if (value.length > 200) return 'Máximo 200 caracteres';
  return undefined;
}

export function validateLogo(value: string): string | undefined {
  if (!value || value.trim().length === 0) return 'Logo es requerido';
  return undefined;
}

export function validateDateRelease(value: string): string | undefined {
  if (!value || value.trim().length === 0) return 'Fecha de liberación es requerida';
  if (!isValidDateStr(value)) return 'Formato de fecha inválido (YYYY-MM-DD)';
  const today = getTodayISO();
  if (value < today) return 'La fecha debe ser igual o mayor a la fecha actual';
  return undefined;
}

export function validateDateRevision(value: string, dateRelease: string): string | undefined {
  if (!value || value.trim().length === 0) return 'Fecha de revisión es requerida';
  if (!dateRelease || !isValidDateStr(dateRelease)) return undefined;
  const expected = addOneYear(dateRelease);
  if (!expected || value !== expected) return 'Debe ser exactamente un año posterior a la fecha de liberación';
  return undefined;
}

export function validateForm(
  fields: {
    id: string;
    name: string;
    description: string;
    logo: string;
    date_release: string;
    date_revision: string;
  },
  isEdit = false,
): FormErrors {
  const errors: FormErrors = {};
  if (!isEdit) {
    const idError = validateId(fields.id);
    if (idError) errors.id = idError;
  }
  const nameError = validateName(fields.name);
  if (nameError) errors.name = nameError;
  const descError = validateDescription(fields.description);
  if (descError) errors.description = descError;
  const logoError = validateLogo(fields.logo);
  if (logoError) errors.logo = logoError;
  const releaseError = validateDateRelease(fields.date_release);
  if (releaseError) errors.date_release = releaseError;
  const revisionError = validateDateRevision(fields.date_revision, fields.date_release);
  if (revisionError) errors.date_revision = revisionError;
  return errors;
}
