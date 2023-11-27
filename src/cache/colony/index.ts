import tokensField from './tokens';
import balancesField from './balances';

const colony = {
  Colony: {
    fields: {
      ...tokensField,
      ...balancesField,
    },
  },
};

export default colony;
