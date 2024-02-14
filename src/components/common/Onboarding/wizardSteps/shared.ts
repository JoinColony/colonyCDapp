import { type FieldErrors, type FieldValues } from 'react-hook-form';
import { defineMessages } from 'react-intl';

export const getInputError = (
  errors: FieldErrors<FieldValues>,
  errorName: string,
  submitCount: number,
) => {
  const error = errors[errorName]?.message as string | undefined;

  const showError = Boolean(
    errors[errorName]?.type === 'required' && submitCount === 0 ? false : error,
  );

  return { error, showError };
};

const displayName = 'common.CreateColonyWizard.shared.TokenChoice';

export const MSGTokenChoice = defineMessages({
  heading: {
    id: `${displayName}.heading`,
    defaultMessage: 'Creating a new native token or use existing?',
  },
  description: {
    id: `${displayName}.description`,
    defaultMessage:
      'We highly recommend creating a new token, you will have greater control of your token going forward, support all features of Colony, and potentially save a lot of cost if on another chain.',
  },
  createOptionTitle: {
    id: `${displayName}.createOptionTitle`,
    defaultMessage: 'Create a new token',
  },
  createOptionDescription: {
    id: `${displayName}.createOptionDescription`,
    defaultMessage:
      'Quickest, easiest, and best option for greater control over your token using your Colony.',
  },
  selectOptionTitle: {
    id: `${displayName}.selectOptionTitle`,
    defaultMessage: 'Use an existing token',
  },
  selectOptionDescription: {
    id: `${displayName}.selectOptionDescription`,
    defaultMessage:
      'Suitable for public tokens. Requires token to be on the same blockchain as the Colony.',
  },
});
