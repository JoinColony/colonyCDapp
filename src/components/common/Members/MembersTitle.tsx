import React, { useRef, MouseEvent, RefObject } from 'react';
import { defineMessages } from 'react-intl';

import Heading from '~shared/Heading';
import Icon from '~shared/Icon';
import { useMobile } from '~hooks';
import ColonyDomainSelector from '~common/ColonyHome/ColonyDomainSelector';
import { formatText } from '~utils/intl';
import { SelectOption } from '~shared/Fields/Select';
import MembersDomainSelector from '~common/Members/MembersDomainSelector';

import styles from './MembersTitle.css';

const displayName = 'common.Members.MembersTitle';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: `{isMobile, select,
      true {Members}
      other {Members: }
    }
  `,
  },
  search: {
    id: `${displayName}.search`,
    defaultMessage: 'Search',
  },
  searchPlaceholder: {
    id: `${displayName}.searchPlaceholder`,
    defaultMessage: 'Search...',
  },
  labelFilter: {
    id: `${displayName}.labelFilter`,
    defaultMessage: 'Filter',
  },
});

const handleSearchIconFocus = (searchInput: RefObject<HTMLInputElement>) => {
  searchInput?.current?.focus();
};

const handleSearchIconEnter = (searchInput: RefObject<HTMLInputElement>) => {
  if (searchInput.current !== null) {
    const input = searchInput.current;
    input.placeholder = formatText(MSG.searchPlaceholder) ?? '';
  }
};

const handleSearchIconLeave = (searchInput: RefObject<HTMLInputElement>) => {
  if (searchInput.current !== null) {
    const input = searchInput.current;
    input.placeholder = '';
  }
};

const handleMouseEnter = (e: MouseEvent<HTMLInputElement>) => {
  e.currentTarget.placeholder = formatText(MSG.searchPlaceholder) as string;
};

const handleMouseLeave = (e: MouseEvent<HTMLInputElement>) => {
  e.currentTarget.placeholder = '';
};

interface Props {
  currentDomainId: number;
  domainSelectOptions: SelectOption[];
  handleDomainChange: (domainId: number) => void;
  searchValue: string;
  handleSearch: (e: React.ChangeEvent | React.MouseEvent) => void;
}

const MembersTitle = ({
  currentDomainId,
  handleDomainChange,
  domainSelectOptions,
  searchValue,
  handleSearch,
}: Props) => {
  const searchInput = useRef<HTMLInputElement>(null);
  const isMobile = useMobile();

  return (
    <div className={styles.titleContainer}>
      <div className={styles.titleLeft}>
        <Heading
          text={MSG.title}
          appearance={{ size: 'medium', theme: 'dark' }}
          textValues={{ isMobile }}
        />
        {isMobile ? (
          <ColonyDomainSelector
            filteredDomainId={currentDomainId}
            onDomainChange={handleDomainChange}
          />
        ) : (
          <MembersDomainSelector
            currentDomainId={currentDomainId}
            handleDomainChange={handleDomainChange}
            domainSelectOptions={domainSelectOptions}
          />
        )}
      </div>
      {!isMobile && (
        <div className={styles.searchContainer}>
          <input
            name="search"
            ref={searchInput}
            value={searchValue}
            className={styles.input}
            onChange={handleSearch}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
          {searchValue && (
            <button
              className={styles.clearButton}
              onClick={handleSearch}
              type="button"
            >
              <Icon
                appearance={{ size: 'normal' }}
                name="close"
                title={{ id: 'button.close' }}
              />
            </button>
          )}
          <Icon
            appearance={{ size: 'normal' }}
            className={styles.icon}
            name="search"
            title={MSG.search}
            onClick={() => handleSearchIconFocus(searchInput)}
            onMouseEnter={() => handleSearchIconEnter(searchInput)}
            onMouseLeave={() => handleSearchIconLeave(searchInput)}
          />
        </div>
      )}
    </div>
  );
};

MembersTitle.displayName = displayName;

export default MembersTitle;
