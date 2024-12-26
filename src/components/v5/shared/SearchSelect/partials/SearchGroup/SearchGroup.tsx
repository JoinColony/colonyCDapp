import React from 'react';

import { formatText } from '~utils/intl.ts';
import {
  type SearchSelectOptionProps,
  type SearchSelectProps,
} from '~v5/shared/SearchSelect/types.ts';

import { AccordionWrapper } from '../AccordionWrapper/AccordionWrapper.tsx';
import CheckboxSearchItem from '../CheckboxSearchItem/CheckboxSearchItem.tsx';
import SearchItem from '../SearchItem/SearchItem.tsx';

type SearchGroupProps<T> = SearchSelectOptionProps<T> &
  Pick<SearchSelectProps<T>, 'checkboxesList' | 'onSelect' | 'renderOption'> & {
    onClick: () => void;
    isOpen?: boolean;
  };

export const SearchGroup = <T,>({
  isAccordion,
  options,
  title: titleDescriptor,
  checkboxesList,
  onClick,
  onSelect,
  renderOption,
  isOpen,
}: SearchGroupProps<T>) => {
  const title = (
    <h5 className="mb-2 uppercase text-gray-400 text-4">
      {formatText(titleDescriptor)}
    </h5>
  );
  const content = checkboxesList ? (
    <CheckboxSearchItem
      renderOption={renderOption}
      options={options}
      onChange={onSelect}
      checkboxesList={checkboxesList}
    />
  ) : (
    <SearchItem
      renderOption={renderOption}
      options={options}
      onChange={onSelect}
    />
  );

  if (isAccordion) {
    return (
      <AccordionWrapper title={title} onClick={onClick} isOpen={isOpen}>
        {content}
      </AccordionWrapper>
    );
  }

  return (
    <div className="mb-[0.625rem] last:mb-0">
      {title}
      {content}
    </div>
  );
};
