import React, { useRef, MouseEvent, ChangeEvent } from 'react';
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

interface Props {
  currentDomainId: number;
  domainSelectOptions: SelectOption[];
  handleDomainChange: (domainId: number) => void;
  searchValue: string;
  handleSearch: (e: ChangeEvent | MouseEvent) => void;
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
            placeholder={formatText(MSG.searchPlaceholder)}
          />

          <Icon
            appearance={{ size: 'normal' }}
            className={styles.icon}
            name="search"
            title={MSG.search}
          />
        </div>
      )}
    </div>
  );
};

MembersTitle.displayName = displayName;

export default MembersTitle;
