export const validColonyNameFieldValues = [
  'Valid Name', // Simple, valid name
  'A', // Minimum valid length (1 character)
  'A'.repeat(20), // Maximum valid length (20 characters)
];

export const invalidColonyNameFieldValues = [
  'A'.repeat(21), // More than 20 characters
  ' VeryLongName123456789', // 21 characters after trimming
];

export const validColonyURLFieldValues = [
  'ValidColony',
  'test123',
  'a'.repeat(20),
];
export const invalidColonyURLFieldValues = [
  'invalid name',
  '/invalid',
  'a'.repeat(21),
  'account', // Reserved keyword
];
