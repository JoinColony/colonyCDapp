import React, { FC } from 'react';
import { useController } from 'react-hook-form';

import { isAddress } from 'ethers/lib/utils';
import clsx from 'clsx';
import { TokenSelectProps } from './types';
import useToggle from '~hooks/useToggle';
import SearchSelect from '~v5/shared/SearchSelect/SearchSelect';
import { useRelativePortalElement } from '~hooks/useRelativePortalElement';
import { formatText } from '~utils/intl';
import { useTokenSelect } from './hooks';

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
  const { tokenOptions, isRemoteTokenAddress, renderButtonContent } =
    useTokenSelect(field.value);
  const { portalElementRef, relativeElementRef } = useRelativePortalElement<
    HTMLButtonElement,
    HTMLDivElement
  >([isTokenSelectVisible]);

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
          items={[
            isRemoteTokenAddress
              ? { ...tokenOptions, options: [] }
              : tokenOptions,
          ]}
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
