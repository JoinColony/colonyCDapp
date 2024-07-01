import { object, string } from 'yup';

import { schema } from './schema.ts';

// Example usage
createAction(
  schema,
  ({ addParams, colony }) => ({
    moveFunds: {
      index: 0,
      async run({ amount, to, from, tokenAddress }) {
        const [{ hash }, mined] = await colony
          .moveFundsToTeam(amount, to, from, tokenAddress)
          .tx()
          .send();

        await addParams('annotate', { txHash: hash });
        await mined();
        return hash;
      },
    },
    annotate: {
      index: 1,
      async run({ description }, { txHash }) {
        if (!description) {
          return null;
        }

        const [{ hash }, mined] = await colony
          .annotateTransaction(txHash, { annotationMsg: description })
          .tx()
          .send();

        await mined();
        return hash;
      },
    },
  }),
  {
    annotate: object({ txHash: string().required() }).defined(),
  },
);
