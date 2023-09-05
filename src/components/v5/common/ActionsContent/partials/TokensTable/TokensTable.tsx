import React from 'react';
import { useIntl } from 'react-intl';
import { v4 as uuidv4 } from 'uuid';

import styles from './TokensTable.module.css';
import Button from '~v5/shared/Button';
import TokensItem from '../TokensItem';
import { useTokenTable } from './hooks';

const displayName = 'v5.common.ActionsContent.partials.TokensTable';

const TokensTable = () => {
  const { formatMessage } = useIntl();
  const { handleRemoveRowClick, setTokensList, tokensList, updateTokens } =
    useTokenTable();

  return (
    <div className="mt-7">
      <div className="mb-6">
        <h5 className="text-2 mb-3">
          {formatMessage({ id: 'actionSidebar.approvedTokens' })}
        </h5>
        <div className="border border-gray-200 rounded-lg">
          <div className={styles.tableHead}>
            <span className="w-1/2">Token</span>
            <span className="w-1/2">Symbol</span>
          </div>
          <div>
            {tokensList.length > 0 &&
              tokensList.map((token) => (
                <TokensItem
                  key={token.key}
                  id={token.key}
                  token={token}
                  onRemoveClick={handleRemoveRowClick}
                  onUpdate={updateTokens}
                />
              ))}
          </div>
        </div>
      </div>
      <Button
        mode="primaryOutline"
        iconName="plus"
        size="small"
        text={{ id: 'button.addToken' }}
        onClick={() => {
          setTokensList([
            ...tokensList,
            {
              tokenAddress: '',
              key: uuidv4(),
              symbol: '',
              name: '',
              decimals: 0,
            },
          ]);
        }}
      />
    </div>
  );
};

TokensTable.displayName = displayName;

export default TokensTable;
