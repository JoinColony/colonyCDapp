import balancesField from './balances';
import tokensField from './tokens';

const colony = {
  Colony: {
    fields: {
      ...tokensField,
      ...balancesField,
    },
  },
};

export default colony;
