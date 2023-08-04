import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import { SearchInputProps } from './types';
import Icon from '~shared/Icon';
import styles from './SearchInput.module.css';

const displayName = 'v5.SearchSelect.partials.SearchInput';

const SearchInput: FC<SearchInputProps> = ({ onInput }) => {
  const { formatMessage } = useIntl();

  return (
    <div className="relative w-full">
      <span className="absolute top-3 left-3 flex">
        <Icon name="magnifying-glass" appearance={{ size: 'tiny' }} />
      </span>
      <input
        name="search"
        className={styles.input}
        placeholder={formatMessage({ id: 'placeholder.search' })}
        onChange={onInput}
      />
    </div>
  );
};

SearchInput.displayName = displayName;

export default SearchInput;
