import React, { FC, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useController, useFormContext } from 'react-hook-form';

import { isAddress } from 'ethers/lib/utils';
import { TokensItemProps } from './types';
import TokenIcon from '~shared/TokenIcon';
import Icon from '~shared/Icon';
import styles from './TokensItem.module.css';
import { useDetectClickOutside } from '~hooks';
import useToggle from '~hooks/useToggle';
import Card from '~v5/shared/Card';
import { createAddress } from '~utils/web3';
import { useGetTokenFromEverywhereQuery } from '~gql';
import { TextButton } from '~v5/shared/Button';
import SearchInput from '~v5/shared/SearchSelect/partials/SearchInput';
import getTokenList from '~common/Dialogs/TokenManagementDialog/TokenManagementDialogForm/getTokenList';

const displayName = 'v5.common.ActionsContent.partials.TokensItem';

const TokensItem: FC<TokensItemProps> = ({
  token,
  id,
  onRemoveClick,
  onUpdate,
}) => {
  const { formatMessage } = useIntl();
  const { field } = useController({
    name: `tokenAddress-${id}`,
  });
  const { field: tokenField } = useController({
    name: `token-${id}`,
  });
  const networkTokenList = getTokenList();

  const [isError, setIsError] = useState(false);
  const { watch, clearErrors } = useFormContext();
  const tokenAddressField = watch(`token-${id}`);
  const tokenAddress = isAddress(tokenAddressField)
    ? createAddress(tokenAddressField)
    : tokenAddressField;

  const { data, loading } = useGetTokenFromEverywhereQuery({
    variables: {
      input: {
        tokenAddress,
      },
    },
    skip: !isAddress(tokenAddress),
  });
  const searchedToken = data?.getTokenFromEverywhere?.items?.[0] ?? null;

  useEffect(() => {
    if (searchedToken) {
      field.onChange(searchedToken.tokenAddress);
      clearErrors(`tokenAddress-${id}`);

      onUpdate(id, {
        tokenAddress: searchedToken.tokenAddress,
        name: searchedToken.name,
        decimals: searchedToken.decimals,
        symbol: searchedToken.symbol,
        isTokenNative: false,
        key: id,
      });
    }
  }, [searchedToken]);

  useEffect(() => {
    if (!loading && tokenAddressField) {
      setIsError(true);
    }

    if (tokenAddressField === '' || searchedToken) {
      setIsError(false);
    }
  }, [loading, searchedToken, tokenAddressField]);

  const [
    isTokenMenuVisible,
    { toggle: toggleTokenMenu, toggleOff: toggleOffTokenMenu },
  ] = useToggle();
  const ref = useDetectClickOutside({
    onTriggered: () => toggleOffTokenMenu(),
  });
  const [
    isAddTokenMenuVisible,
    { toggle: toggleAddTokenMenu, toggleOff: toggleOffAddTokenMenu },
  ] = useToggle();
  const addTokenRef = useDetectClickOutside({
    onTriggered: () => toggleOffAddTokenMenu(),
  });

  return (
    <div className="flex items-center py-3 px-4 border-b border-gray-200 last:border-b-0 relative">
      <div className="w-1/2 flex items-center gap-2 sm:relative">
        {token.name ? (
          <>
            <TokenIcon token={token} size="xxs" />
            <p className="text-1">{token.name}</p>
          </>
        ) : (
          <>
            {searchedToken && !isError && (
              <>
                <span className="text-md text-success-400">
                  {searchedToken.name}
                </span>
                <input className="hidden" disabled {...field} />
              </>
            )}
            {isError && (
              <span className="text-md text-negative-400">
                {formatMessage({ id: 'manageTokensTable.notFound' })}
              </span>
            )}
            {!searchedToken && !isError && (
              <TextButton
                onClick={toggleAddTokenMenu}
                text={{ id: 'manageTokensTable.select' }}
              />
            )}
          </>
        )}
        {isAddTokenMenuVisible && (
          <Card
            className="p-6 w-full sm:max-w-[20.375rem] absolute
            top-[calc(100%-1rem)] left-0 sm:left-auto sm:right-3 z-50"
            hasShadow
            rounded="s"
            ref={addTokenRef}
          >
            <div className="mb-5">
              <SearchInput {...tokenField} />
            </div>
            <div>
              <span className="text-4 uppercase text-gray-400">
                available tokens
              </span>
              <ul className="-ml-3.5">
                {networkTokenList
                  .map((networkToken) => networkToken?.token)
                  .map((item) => (
                    <li key={item.tokenAddress}>
                      <button
                        type="button"
                        className="subnav-button"
                        onClick={() => {
                          field.onChange(item.tokenAddress);

                          onUpdate(id, {
                            tokenAddress: item.tokenAddress,
                            name: item.name,
                            decimals: item.decimals,
                            symbol: item.symbol,
                            isTokenNative: false,
                            key: id,
                          });
                          toggleOffAddTokenMenu();
                        }}
                      >
                        <span className="flex items-center gap-2">
                          <TokenIcon token={item} size="xxs" />
                          {item.name}
                        </span>
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          </Card>
        )}
      </div>
      <div className="w-1/2 flex items-center justify-between relative">
        <p className="text-md">{token.symbol}</p>
        {!token.isTokenNative && (
          <button
            type="button"
            className={styles.dotsButton}
            aria-label={formatMessage({ id: 'ariaLabel.openMenu' })}
            onClick={toggleTokenMenu}
          >
            <Icon name="dots-three" appearance={{ size: 'extraTiny' }} />
          </button>
        )}
        {isTokenMenuVisible && (
          <Card
            className="py-4 px-3 w-full sm:max-w-[12rem] absolute top-[calc(100%-1rem)] right-3 z-50"
            hasShadow
            rounded="s"
            ref={ref}
          >
            <ul>
              <li className="mb-4 last:mb-0">
                <button
                  type="button"
                  className="subnav-button"
                  onClick={() => {
                    onRemoveClick(id);
                    toggleOffTokenMenu();
                  }}
                >
                  <span className="text-gray-900 flex items-center gap-2">
                    <Icon name="trash" appearance={{ size: 'tiny' }} />
                    {formatMessage({ id: 'button.remove.row' })}
                  </span>
                </button>
              </li>
            </ul>
          </Card>
        )}
      </div>
    </div>
  );
};

TokensItem.displayName = displayName;

export default TokensItem;
