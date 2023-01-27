import React, { useRef, MouseEvent } from 'react';
import { defineMessages } from 'react-intl';

import Heading from '~shared/Heading';
import Icon from '~shared/Icon';
import { Select, Form } from '~shared/Fields';
import { useMobile } from '~hooks';
import ColonyDomainSelector from '~common/ColonyHome/ColonyDomainSelector';
import { formatText } from '~utils/intl';

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

interface Props {
  currentDomainId: number;
  domainSelectOptions: {
    value: string;
    label: string;
  }[];
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
  const handleFocusRef = () => {
    searchInput?.current?.focus();
  };

  const handleMouseEnterRef = () => {
    if (searchInput.current !== null) {
      searchInput.current.placeholder = formatText(MSG.searchPlaceholder) ?? '';
    }
  };

  const handleMouseLeaveRef = () => {
    if (searchInput.current !== null) {
      searchInput.current.placeholder = '';
    }
  };

  const handleMouseEnter = (e: MouseEvent<HTMLInputElement>) => {
    e.currentTarget.placeholder = formatText(MSG.searchPlaceholder) as string;
  };

  const handleMouseLeave = (e: MouseEvent<HTMLInputElement>) => {
    e.currentTarget.placeholder = '';
  };

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
          <Form
            initialValues={{ filter: currentDomainId.toString() }}
            onSubmit={() => {}}
          >
            <div className={styles.titleSelect}>
              <Select
                appearance={{
                  alignOptions: 'right',
                  size: 'mediumLarge',
                  theme: 'alt',
                  // unrestrictedOptionsWidth: 'true',
                }}
                elementOnly
                label={MSG.labelFilter}
                name="filter"
                onChange={(domainId) =>
                  handleDomainChange(parseInt(domainId, 10))
                }
                options={domainSelectOptions}
              />
            </div>
          </Form>
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
            onClick={handleFocusRef}
            onMouseEnter={handleMouseEnterRef}
            onMouseLeave={handleMouseLeaveRef}
          />
        </div>
      )}
    </div>
  );
};

MembersTitle.displayName = displayName;

export default MembersTitle;
