import React, { type FC } from 'react';
import { type PropsGetterArgs } from 'react-popper-tooltip';

import PopoverBase from '../PopoverBase/PopoverBase.tsx';

import SearchSelect from './SearchSelect.tsx';
import { type SearchSelectProps } from './types.ts';

interface SearchSelectPopoverProps extends SearchSelectProps {
  setTooltipRef: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  tooltipProps: (args?: PropsGetterArgs) => {
    'data-popper-interactive'?: boolean;
    style: React.CSSProperties;
  };
  triggerRef: HTMLElement | null;
}

const SearchSelectPopover: FC<SearchSelectPopoverProps> = ({
  onSelect,
  tooltipProps,
  setTooltipRef,
  triggerRef,
  ...rest
}) => {
  return (
    <PopoverBase
      setTooltipRef={setTooltipRef}
      tooltipProps={tooltipProps}
      withTooltipStyles={false}
    >
      <SearchSelect
        {...rest}
        onSelect={(val) => {
          if (onSelect) {
            onSelect(val);
          }
          // We keep doing this until someone replaces popper with something better
          triggerRef?.click();
        }}
      />
    </PopoverBase>
  );
};

export default SearchSelectPopover;
