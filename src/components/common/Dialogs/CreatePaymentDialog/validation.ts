import { string, object, number, boolean } from 'yup';
import Decimal from 'decimal.js';
import { defineMessages } from 'react-intl';

const displayName = 'common.CreatePaymentDialog';

const MSG = defineMessages({
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
            walletAddress: string().address().required(),
            displayName: string(),
          })
          .defined(),
      })
      .defined(),
    amount: string()
      .required()
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
