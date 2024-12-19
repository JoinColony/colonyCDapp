import React, { type FC } from 'react';

import MaskedAddress from '~shared/MaskedAddress/MaskedAddress.tsx';
import { type ColonyAction } from '~types/graphql.ts';
import { decodeArbitraryTransaction } from '~utils/arbitraryTxs.ts';

interface ArbitraryTransactionProps {
  action: ColonyAction;
}

const ArbitraryTransaction: FC<ArbitraryTransactionProps> = ({ action }) => {
  // eslint-disable-next-line no-console
  console.log('action:', action);

  return (
    <div className="flex flex-col gap-4">
      {action.arbitraryTransactions?.map((transaction) => {
        const abi = action.metadata?.arbitraryTxAbis?.find(
          (abiItem) => abiItem.contractAddress === transaction.contractAddress,
        );

        if (!abi) {
          return <div>No ABI found</div>;
        }

        const decodedTx = decodeArbitraryTransaction(
          abi.jsonAbi,
          transaction.encodedFunction,
        );

        if (!decodedTx) {
          return <div>Failed to decode transaction</div>;
        }

        return (
          <div className="flex flex-col gap-2 border-b-2">
            <div>
              Contract address:
              <MaskedAddress address={transaction.contractAddress} />
            </div>
            Method: {decodedTx.method}
            {decodedTx.args?.map((arg) => {
              return (
                <div key={arg.name}>
                  {arg.name} ({arg.type}): {arg.value}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default ArbitraryTransaction;
