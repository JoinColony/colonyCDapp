import { defineMessages } from 'react-intl';
import * as yup from 'yup';

const MSG = defineMessages({
  requiredFieldError: {
    id: 'dashboard.ControlSafeDialog.validation.requiredFieldError',
    defaultMessage: 'Please enter a value',
  },
});

export const getValidationSchema = () =>
  yup.object().shape({
    safe: yup.object().shape({
      id: yup.string().address().required(),
      profile: yup
        .object()
        .shape({
          displayName: yup.string().required(),
          walletAddress: yup.string().address().required(),
        })
        .required(() => MSG.requiredFieldError),
    }),
    transactions: yup.array(
      yup.object().shape({
        transactionType: yup.string().required(() => MSG.requiredFieldError),
        recipient: yup.object(),
      }),
    ),
  });
