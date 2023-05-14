import { TypePolicies } from '@apollo/client';

import tokensField from './tokens';
import balancesField from './balances';

const colony: TypePolicies = {
  Colony: {
    keyFields: ['colonyAddress'],
    fields: {
      ...tokensField,
      ...balancesField,
    },
  },
};

export default colony;
