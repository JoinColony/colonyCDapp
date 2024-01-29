import balancesField from './balances.ts';
import tokensField from './tokens.ts';

const colony = {
  Colony: {
    fields: {
      ...tokensField,
      ...balancesField,
    },
  },
};

export default colony;
