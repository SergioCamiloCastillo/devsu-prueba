import {
  validateId,
  validateName,
  validateDescription,
  validateLogo,
  validateDateRelease,
  validateDateRevision,
  validateForm,
  addOneYear,
  getTodayISO,
  formatDateToISO,
  isValidDateStr,
} from '../utils/validation';

describe('formatDateToISO', () => {
  it('formats a date to YYYY-MM-DD', () => {
    const date = new Date('2025-06-15T00:00:00.000Z');
    expect(formatDateToISO(date)).toBe('2025-06-15');
  });
});

describe('isValidDateStr', () => {
  it('returns true for valid YYYY-MM-DD strings', () => {
    expect(isValidDateStr('2025-01-01')).toBe(true);
    expect(isValidDateStr('2099-12-31')).toBe(true);
  });

  it('returns false for incomplete or invalid strings', () => {
    expect(isValidDateStr('')).toBe(false);
    expect(isValidDateStr('2025-0')).toBe(false);
    expect(isValidDateStr('2025-13-01')).toBe(false);
    expect(isValidDateStr('not-a-date')).toBe(false);
    expect(isValidDateStr('2025/01/01')).toBe(false);
  });
});

describe('addOneYear', () => {
  it('adds exactly one year to a valid date string', () => {
    expect(addOneYear('2025-01-01')).toBe('2026-01-01');
    expect(addOneYear('2024-02-29')).toBe('2025-03-01');
  });

  it('returns empty string for invalid/incomplete date strings', () => {
    expect(addOneYear('')).toBe('');
    expect(addOneYear('2025-0')).toBe('');
    expect(addOneYear('not-a-date')).toBe('');
  });
});

describe('getTodayISO', () => {
  it('returns today in YYYY-MM-DD format', () => {
    const today = new Date().toISOString().split('T')[0];
    expect(getTodayISO()).toBe(today);
  });
});

describe('validateId', () => {
  it('returns error when empty', () => {
    expect(validateId('')).toBe('ID es requerido');
    expect(validateId('  ')).toBe('ID es requerido');
  });

  it('returns error when less than 3 chars', () => {
    expect(validateId('ab')).toBe('Mínimo 3 caracteres');
  });

  it('returns error when more than 10 chars', () => {
    expect(validateId('abcdefghijk')).toBe('Máximo 10 caracteres');
  });

  it('returns undefined for valid id', () => {
    expect(validateId('abc')).toBeUndefined();
    expect(validateId('abcde12345')).toBeUndefined();
  });
});

describe('validateName', () => {
  it('returns error when empty', () => {
    expect(validateName('')).toBe('Nombre es requerido');
  });

  it('returns error when less than 5 chars', () => {
    expect(validateName('abcd')).toBe('Mínimo 5 caracteres');
  });

  it('returns error when more than 100 chars', () => {
    expect(validateName('a'.repeat(101))).toBe('Máximo 100 caracteres');
  });

  it('returns undefined for valid name', () => {
    expect(validateName('Tarjeta Crédito')).toBeUndefined();
  });
});

describe('validateDescription', () => {
  it('returns error when empty', () => {
    expect(validateDescription('')).toBe('Descripción es requerida');
  });

  it('returns error when less than 10 chars', () => {
    expect(validateDescription('short')).toBe('Mínimo 10 caracteres');
  });

  it('returns error when more than 200 chars', () => {
    expect(validateDescription('a'.repeat(201))).toBe('Máximo 200 caracteres');
  });

  it('returns undefined for valid description', () => {
    expect(validateDescription('Descripción válida del producto')).toBeUndefined();
  });
});

describe('validateLogo', () => {
  it('returns error when empty', () => {
    expect(validateLogo('')).toBe('Logo es requerido');
    expect(validateLogo('  ')).toBe('Logo es requerido');
  });

  it('returns undefined for valid logo', () => {
    expect(validateLogo('https://example.com/logo.png')).toBeUndefined();
  });
});

describe('validateDateRelease', () => {
  it('returns error when empty', () => {
    expect(validateDateRelease('')).toBe('Fecha de liberación es requerida');
  });

  it('returns error when date is in the past', () => {
    expect(validateDateRelease('2020-01-01')).toBe(
      'La fecha debe ser igual o mayor a la fecha actual',
    );
  });

  it('returns undefined for today or future date', () => {
    const today = getTodayISO();
    expect(validateDateRelease(today)).toBeUndefined();
    expect(validateDateRelease('2099-01-01')).toBeUndefined();
  });
});

describe('validateDateRevision', () => {
  it('returns error when empty', () => {
    expect(validateDateRevision('', '2025-01-01')).toBe('Fecha de revisión es requerida');
  });

  it('returns error when not exactly one year after release', () => {
    expect(validateDateRevision('2025-06-01', '2025-01-01')).toBe(
      'Debe ser exactamente un año posterior a la fecha de liberación',
    );
  });

  it('returns undefined when exactly one year after release', () => {
    expect(validateDateRevision('2026-01-01', '2025-01-01')).toBeUndefined();
  });

  it('returns undefined when release date is not provided', () => {
    expect(validateDateRevision('2026-01-01', '')).toBeUndefined();
  });
});

describe('validateForm', () => {
  const validForm = {
    id: 'abc123',
    name: 'Tarjeta Crédito',
    description: 'Descripción válida del producto financiero',
    logo: 'https://example.com/logo.png',
    date_release: '2099-01-01',
    date_revision: '2100-01-01',
  };

  it('returns no errors for a valid form', () => {
    expect(validateForm(validForm)).toEqual({});
  });

  it('returns errors for all invalid fields', () => {
    const errors = validateForm({
      id: '',
      name: '',
      description: '',
      logo: '',
      date_release: '',
      date_revision: '',
    });
    expect(errors.id).toBeDefined();
    expect(errors.name).toBeDefined();
    expect(errors.description).toBeDefined();
    expect(errors.logo).toBeDefined();
    expect(errors.date_release).toBeDefined();
    expect(errors.date_revision).toBeDefined();
  });

  it('skips id validation in edit mode', () => {
    const errors = validateForm({ ...validForm, id: '' }, true);
    expect(errors.id).toBeUndefined();
  });
});
