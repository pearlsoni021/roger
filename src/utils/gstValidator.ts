/**
 * Indian GSTIN and PAN validation utilities
 */

export interface GstValidationResult {
  isValid: boolean;
  stateCode?: string;
  stateName?: string;
  pan?: string;
  entityCode?: string;
  error?: string;
}

const STATE_CODES: Record<string, string> = {
  '01': 'Jammu and Kashmir',
  '02': 'Himachal Pradesh',
  '03': 'Punjab',
  '04': 'Chandigarh',
  '06': 'Haryana',
  '07': 'Delhi',
  '08': 'Rajasthan',
  '09': 'Uttar Pradesh',
  '19': 'West Bengal',
  '24': 'Gujarat',
  '27': 'Maharashtra',
  '29': 'Karnataka',
  '32': 'Kerala',
  '33': 'Tamil Nadu',
  '36': 'Telangana',
  '37': 'Andhra Pradesh',
};

export function validateGSTIN(gstin: string): GstValidationResult {
  if (!gstin || typeof gstin !== 'string') {
    return { isValid: false, error: 'GSTIN is required' };
  }

  const cleanGstin = gstin.trim().toUpperCase();

  // Pattern: 2 digits state code + 10 chars PAN + 1 digit entity + 1 char (usually Z) + 1 check digit
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

  if (cleanGstin.length !== 15) {
    return { isValid: false, error: `Invalid length: Expected 15 characters, got ${cleanGstin.length}` };
  }

  if (!gstinRegex.test(cleanGstin)) {
    return { isValid: false, error: 'Invalid GSTIN syntax format (e.g. 29AAAAA0000A1Z5)' };
  }

  const stateCode = cleanGstin.substring(0, 2);
  const pan = cleanGstin.substring(2, 12);
  const entityCode = cleanGstin.substring(12, 13);
  const stateName = STATE_CODES[stateCode] || 'Other State / UT';

  return {
    isValid: true,
    stateCode,
    stateName,
    pan,
    entityCode,
  };
}

export function validatePAN(pan: string): boolean {
  if (!pan || typeof pan !== 'string') return false;
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan.trim().toUpperCase());
}
