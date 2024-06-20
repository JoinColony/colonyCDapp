import React, { type PropsWithChildren, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useUserTransactionContext } from '~context/UserTransactionContext/UserTransactionContext.ts';
import { type TransactionType } from '~redux/immutable/Transaction.ts';
import { TX_SEARCH_PARAM } from '~routes';
import InputBase from '~v5/common/Fields/InputBase/InputBase.tsx';

import { TmpContext } from './TmpContext.ts';

export const TmpContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [annotation, setAnnotation] = useState('');

  const { transactionAndMessageGroups } = useUserTransactionContext();

  const navigate = useNavigate();

  const value = useMemo(
    () => ({
      annotation,
      setAnnotation,
    }),
    [annotation],
  );

  const latestTx = transactionAndMessageGroups[0]?.[0] as TransactionType;

  const openTransaction = () => {
    navigate(`${window.location.pathname}?${TX_SEARCH_PARAM}=${latestTx.hash}`);
  };

  return (
    <TmpContext.Provider value={value}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 rounded-lg bg-gray-100 p-3">
          <section>
            <h2 className="mb-3 block w-full font-bold">
              Common action form fields
            </h2>
            <div>
              <InputBase
                onChange={(e) => setAnnotation(e.currentTarget.value)}
                value={annotation}
                label="Annotation"
                placeholder="Enter a description"
              />
            </div>
          </section>
          <section>
            <h2 className="mb-4 block w-full font-bold">Debug values</h2>
            <div className="flex flex-col gap-2 rounded-md bg-base-white p-4">
              <div className="flex items-center gap-2 ">
                <p className="text-md font-bold">Latest Transaction</p>
                {latestTx && (
                  <button
                    className="rounded-md bg-base-black px-2 py-1 text-sm text-base-white"
                    type="button"
                    onClick={openTransaction}
                  >
                    Click to view on the User Hub
                  </button>
                )}
              </div>
              <p className="text-md">Hash: {latestTx?.hash ?? 'null'}</p>
              <p className="flex text-md">
                Context: {latestTx?.context ?? 'null'}
              </p>
              <p className="flex text-md">
                Method name: {latestTx?.methodName}
              </p>
            </div>
          </section>
        </div>
        {children}
      </div>
    </TmpContext.Provider>
  );
};
