import React, { FC } from 'react';

import clsx from 'clsx';
import Icon from '~shared/Icon';
import { formatText } from '~utils/intl';
import InputBase from '~v5/common/Fields/InputBase';
import { InputBaseProps } from '~v5/common/Fields/InputBase/types';

const displayName = 'v5.SearchSelect.partials.SearchInput';

const SearchInput: FC<InputBaseProps> = ({ className, ...rest }) => (
  <div className="relative w-full">
    <span className={clsx(className, 'absolute top-[0.65rem] left-3 flex')}>
      <Icon name="magnifying-glass" appearance={{ size: 'tiny' }} />
    </span>
    <InputBase
      {...rest}
      className="!py-2 pr-3 pl-8 rounded-lg w-full text-3"
      placeholder={formatText({ id: 'placeholder.search' })}
    />
  </div>
);

SearchInput.displayName = displayName;

export default SearchInput;
