import { string, object, number, boolean } from 'yup';
import Decimal from 'decimal.js';
import { defineMessages } from 'react-intl';

const displayName = 'common.CreatePaymentDialog';

const MSG = defineMessages({
  requiredFieldError: {
    id: `${displayName}.requiredFieldError`,
    defaultMessage: 'Please enter a value',
  },
  amountZero: {
    id: `${displayName}.amountZero`,
    defaultMessage: 'Amount must be greater than zero',
  },
  noBalance: {
    id: `${displayName}.noBalance`,
    defaultMessage: 'Insufficient balance in from domain pot',
  },
});

const validationSchema = object()
  .shape({
    domainId: string().required(),
    recipient: object()
      .shape({
        profile: object()
          .shape({
            displayName: string(),
          })
          .defined(),
        walletAddress: string().address().defined(),
      })
      .default(undefined)
      .required(() => MSG.requiredFieldError),
    amount: string()
      .required(() => MSG.requiredFieldError)
      .test(
        'more-than-zero',
        () => MSG.amountZero,
        (value) => {
          const numberWithouCommas = (value || '0').replace(/,/g, '');
          return !new Decimal(numberWithouCommas).isZero();
        },
      ),
    tokenAddress: string().address().required(),
    annotation: string().max(4000).defined(),
    forceAction: boolean().defined(),
    motionDomainId: number().defined(),
  })
  .defined();

export default validationSchema;
