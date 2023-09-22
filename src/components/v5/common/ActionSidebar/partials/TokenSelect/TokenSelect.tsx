import React, { FC } from 'react';
import { useController } from 'react-hook-form';

import { isAddress } from 'ethers/lib/utils';
import clsx from 'clsx';
import { TokenSelectProps } from './types';
import useToggle from '~hooks/useToggle';
import getTokenList from '~common/Dialogs/TokenManagementDialog/TokenManagementDialogForm/getTokenList';
import SearchSelect from '~v5/shared/SearchSelect/SearchSelect';
import { useRelativePortalElement } from '~hooks/useRelativePortalElement';
import { SearchSelectOptionProps } from '~v5/shared/SearchSelect/types';
import { SpinnerLoader } from '~shared/Preloaders';
import { formatText } from '~utils/intl';
import TokenStatus from './partials/TokenStatus';
import TokenIcon from '~shared/TokenIcon';
import { useGetTokenFromEverywhereQuery } from '~gql';

const displayName = 'v5.common.ActionsContent.partials.TokenSelect';

const TokenSelect: FC<TokenSelectProps> = ({ name }) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
  });
  const isError = !!error;
  const [
    isTokenSelectVisible,
    {
      toggle: toggleTokenSelect,
      toggleOff: toggleTokenSelectOff,
      registerContainerRef,
    },
  ] = useToggle();

  const networkTokenList = getTokenList();

  const isRemoteTokenAddress =
    field.value &&
    isAddress(field.value) &&
    !networkTokenList.some(({ token }) => token.tokenAddress === field.value);
  const { data: tokenData, loading } = useGetTokenFromEverywhereQuery({
    variables: {
      input: {
        tokenAddress: field.value || '',
      },
    },
    skip: !isRemoteTokenAddress,
  });

  const tokens: SearchSelectOptionProps = {
    key: 'tokens',
    title: { id: 'manageTokensTable.availableTokens' },
    options: networkTokenList.map((networkToken) => ({
      label: networkToken.token.name,
      value: networkToken.token.tokenAddress,
      token: networkToken.token,
    })),
  };

  const { portalElementRef, relativeElementRef } = useRelativePortalElement<
    HTMLButtonElement,
    HTMLDivElement
  >([isTokenSelectVisible]);

  const renderButtonContent = () => {
    if (!isRemoteTokenAddress) {
      if (!field.value) {
        return formatText({ id: 'manageTokensTable.select' });
      }

      return (
        <div className="flex items-center gap-2">
          <TokenIcon token={field.value} size="xxs" />
          {formatText(
            tokens.options.find((option) => option.value === field.value)
              ?.label,
          )}
        </div>
      );
    }

    if (loading) {
      return <SpinnerLoader appearance={{ size: 'small' }} />;
    }

    return (
      (
        <TokenStatus status="success">
          {tokenData?.getTokenFromEverywhere?.items?.[0]?.name}
        </TokenStatus>
      ) || (
        <TokenStatus status="error">
          {formatText({ id: 'manageTokensTable.notFound' })}
        </TokenStatus>
      )
    );
  };

  return (
    <div className="sm:relative w-full">
      <button
        type="button"
        ref={relativeElementRef}
        className={clsx(
          'flex text-md transition-colors md:hover:text-blue-400',
          {
            'text-gray-500': !isError,
            'text-negative-400': isError,
          },
        )}
        onClick={toggleTokenSelect}
        aria-label={formatText({ id: 'manageTokensTable.select' })}
      >
        {renderButtonContent()}
      </button>
      {isTokenSelectVisible && (
        <SearchSelect
          showEmptyContent={!isRemoteTokenAddress}
          items={[isRemoteTokenAddress ? { ...tokens, options: [] } : tokens]}
          onSearch={(query) => {
            field.onChange(isAddress(query) ? query : undefined);
          }}
          isOpen={isTokenSelectVisible}
          onToggle={toggleTokenSelect}
          onSelect={(value) => {
            field.onChange(value);
            toggleTokenSelectOff();
          }}
          ref={(ref) => {
            registerContainerRef(ref);
            portalElementRef.current = ref;
          }}
          className="z-[60]"
        />
      )}
    </div>
  );
};

TokenSelect.displayName = displayName;

export default TokenSelect;
