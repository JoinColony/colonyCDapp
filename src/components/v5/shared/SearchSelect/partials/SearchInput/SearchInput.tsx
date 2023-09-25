import React, { FC, InputHTMLAttributes } from 'react';

import Icon from '~shared/Icon';
import { formatText } from '~utils/intl';
import InputBase from '~v5/common/Fields/InputBase';

const displayName = 'v5.SearchSelect.partials.SearchInput';

const SearchInput: FC<InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <div className="relative w-full">
    <span className="absolute top-3.5 left-3 flex">
      <Icon name="magnifying-glass" appearance={{ size: 'tiny' }} />
    </span>
    <InputBase
      {...props}
      mode="primary"
      className="py-2.5 pr-3 pl-8 rounded-lg w-full text-3"
      placeholder={formatText({ id: 'placeholder.search' })}
    />
  </div>
);

SearchInput.displayName = displayName;

export default SearchInput;
