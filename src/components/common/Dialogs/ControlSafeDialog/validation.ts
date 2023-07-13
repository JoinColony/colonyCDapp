import { defineMessages } from 'react-intl';
import { object, string } from 'yup';

const MSG = defineMessages({
  requiredFieldError: {
    id: 'dashboard.ControlSafeDialog.validation.requiredFieldError',
    defaultMessage: 'Please enter a value',
  },
});

export const getValidationSchema = () => {
  return object()
    .shape({
      safe: object().shape({
        id: string().address().required(),
        profile: object()
          .shape({
            displayName: string().required(),
            walletAddress: string().address().required(),
          })
          .required(() => MSG.requiredFieldError),
      }),
    })
    .defined();
};
