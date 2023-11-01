import { defineMessages } from 'react-intl';

export const defaultMessages = defineMessages({
  loading: {
    id: 'asyncText.defaultLoading',
    defaultMessage: 'Loading...',
    description: 'Default loading message for loadable text',
  },
  error: {
    id: 'asyncText.defaultError',
    defaultMessage: 'Failed to load',
    description: 'Default error message for loadable text',
  },
});
