import clsx from 'clsx';
import React, { type FC } from 'react';
import { useController } from 'react-hook-form';

import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.ts';
import useRelativePortalElement from '~hooks/useRelativePortalElement.ts';
import useToggle from '~hooks/useToggle/index.ts';
import { formatText } from '~utils/intl.ts';
import ChainBadge from '~v5/common/Pills/ChainBadge/ChainBadge.tsx';
import { renderIconOption } from '~v5/shared/SearchSelect/partials/OptionRenderer/IconOptionRenderer.tsx';
import SearchSelect from '~v5/shared/SearchSelect/SearchSelect.tsx';

import { type IUseChainOptions, useChainOptions } from './hooks.ts';

const displayName = 'v5.common.ActionsContent.partials.ChainSelect';

interface ChainSelectProps {
  name: string;
  disabled?: boolean;
  readOnly?: boolean;
  filterOptionsFn?: IUseChainOptions['filterOptionsFn'];
}

const ChainSelect: FC<ChainSelectProps> = ({
  name,
  disabled = false,
  readOnly: readOnlyProp,
  filterOptionsFn,
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
  });
  const fieldValue = field.value;
  const isError = !!error;
  const chainOptions = useChainOptions({ filterOptionsFn });

  const { readonly } = useAdditionalFormOptionsContext();
  const isReadOnly = readonly || readOnlyProp;

  const [
    isChainSelectVisible,
    {
      toggle: toggleChainSelect,
      toggleOff: toggleChainSelectOff,
      registerContainerRef,
    },
  ] = useToggle();
  const { portalElementRef, relativeElementRef } = useRelativePortalElement<
    HTMLButtonElement,
    HTMLDivElement
  >([isChainSelectVisible], {
    top: 8,
  });

  const renderButtonContent = () => {
    const selectedChain = fieldValue
      ? chainOptions.find(
          (availableChain) => availableChain.value === fieldValue,
        )
      : null;

    if (!selectedChain) {
      return formatText({ id: 'actionSidebar.chain.placeholder' });
    }

    return <ChainBadge text={selectedChain.label} icon={selectedChain.icon} />;
  };

  return (
    <div className="relative">
      {isReadOnly ? (
        <div
          className={clsx('flex text-md', {
            'text-negative-400': isError,
          })}
        >
          {renderButtonContent()}
        </div>
      ) : (
        <>
          <button
            type="button"
            ref={relativeElementRef}
            onClick={toggleChainSelect}
            className={clsx(
              'flex w-full text-md transition-colors md:hover:text-blue-400',
              {
                'text-gray-900': !isError && !disabled && fieldValue,
                'text-gray-400': !isError && !disabled && !fieldValue,
                'text-negative-400': isError,
                'text-gray-300': disabled,
              },
            )}
            aria-label={formatText({ id: 'actionSidebar.chain.placeholder' })}
          >
            {renderButtonContent()}
          </button>
          {isChainSelectVisible && (
            <SearchSelect
              ref={(ref) => {
                registerContainerRef(ref);
                portalElementRef.current = ref;
              }}
              items={[
                {
                  key: 'chains',
                  title: { id: 'actionSidebar.chain.title' },
                  isAccordion: false,
                  options: chainOptions,
                },
              ]}
              onSelect={(value) => {
                field.onChange(value);

                toggleChainSelectOff();
              }}
              renderOption={renderIconOption}
              className="z-sidebar"
            />
          )}
        </>
      )}
    </div>
  );
};

ChainSelect.displayName = displayName;

export default ChainSelect;
