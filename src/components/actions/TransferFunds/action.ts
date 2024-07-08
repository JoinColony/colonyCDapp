import { object, string } from 'yup';

import { createAction, useAction } from '../index.ts';

import { schema } from './schema.ts';

// Example usage
export const transferFunds = createAction({
  schema,
  txs: ({ addParams, colonyContract }) => ({
    moveFunds: {
      order: 0,
      async run({ amount, to, from, tokenAddress }) {
        const [{ hash }, mined] = await colonyContract
          .moveFundsToTeam(amount, to, from, tokenAddress)
          .tx()
          .send();

        await addParams('annotate', { txHash: hash });
        await mined();
        return hash;
      },
    },
    annotate: {
      order: 1,
      async run({ description }, { txHash }) {
        if (!description) {
          return null;
        }

        const [{ hash }, mined] = await colonyContract
          .annotateTransaction(txHash, { annotationMsg: description })
          .tx()
          .send();

        await mined();
        return hash;
      },
    },
  }),
  extra: {
    annotate: object({ txHash: string().required() }).defined(),
  },
});

// FIXME: better naming of start method
const { run } = useAction(transferFunds);
