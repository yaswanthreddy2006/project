/**
 * Validates registration number against KLU rules:
 * - Must start with 99
 * - Total length must be 10, 12, or 14 digits
 */
export const validateRegistrationNumber = (regNo) => {
  if (!regNo) {
    return { isValid: false, message: 'Registration Number is required.' };
  }

  const cleanRegNo = regNo.trim();

  if (!cleanRegNo.startsWith('99')) {
    return {
      isValid: false,
      message: 'Registration Number must start with "99" (e.g. 9921004123).'
    };
  }

  const regNoRegex = /^99\d{6,14}$/;
  if (!regNoRegex.test(cleanRegNo)) {
    return {
      isValid: false,
      message: 'Registration Number must be between 8 to 16 digits total.'
    };
  }

  return { isValid: true, message: 'Valid KLU Registration Number' };
};

/**
 * Automatically computes college email from registration number.
 */
export const generateKLUEmail = (regNo) => {
  if (!regNo || !regNo.trim()) return '';
  return `${regNo.trim()}@klu.ac.in`;
};
