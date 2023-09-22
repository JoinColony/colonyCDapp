import React, { FC, InputHTMLAttributes } from 'react';
import { useIntl } from 'react-intl';

import Icon from '~shared/Icon';

const displayName = 'v5.SearchSelect.partials.SearchInput';

const SearchInput: FC<InputHTMLAttributes<HTMLInputElement>> = (props) => {
  const { formatMessage } = useIntl();

  return (
    <div className="relative w-full">
      <span className="absolute top-3 left-3 flex">
        <Icon name="magnifying-glass" appearance={{ size: 'tiny' }} />
      </span>
      <input
        {...props}
        className={`py-2.5 pr-3 pl-8 border rounded-lg 
        border-gray-300 w-full text-3 text-gray-500 placeholder:text-gray-500`}
        placeholder={formatMessage({ id: 'placeholder.search' })}
      />
    </div>
  );
};

SearchInput.displayName = displayName;

export default SearchInput;
