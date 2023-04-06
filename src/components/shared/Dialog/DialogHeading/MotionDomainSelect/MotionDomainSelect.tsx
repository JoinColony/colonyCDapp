import React from 'react';
import { Id } from '@colony/colony-js';
import { useIntl, defineMessages, MessageDescriptor } from 'react-intl';

import { SelectOption } from '~shared/Fields';
import DomainDropdown from '~shared/DomainDropdown';

import { Colony } from '~types';

import styles from './MotionDomainSelect.css';

const displayName = 'DialogHeading.MotionDomainSelect';

const MSG = defineMessages({
  createDomain: {
    id: `${displayName}.createDomain`,
    defaultMessage: 'Create motion in ',
  },
});

interface Props {
  colony: Colony;
  name?: string;
  onDomainChange?: (domainId: number) => any;
  filterDomains?: (option: SelectOption) => boolean;
  disabled?: boolean;
  dropdownLabel?: MessageDescriptor;
}

const MotionDomainSelect = ({
  colony,
  name = 'motionDomainId',
  onDomainChange,
  filterDomains,
  disabled = false,
  dropdownLabel,
}: Props) => {
  const { formatMessage } = useIntl();
  const renderActiveOption = (
    option: SelectOption | undefined,
    label: string,
  ) => {
    /*
     * @NOTE This is so that the active item is displayed as `Root/Current Domain`
     * when a subdomain is selected
     */
    let displayLabel =
      (option?.value || Id.RootDomain) === Id.RootDomain
        ? `${formatMessage(dropdownLabel || MSG.createDomain)} ${label}`
        : `${formatMessage(dropdownLabel || MSG.createDomain)} ${formatMessage({
            id: 'domain.root',
          })}/${label}`;
    /*
     * @NOTE If the filtering function removed our previously selected option,
     * reset the selection back to Root
     */
    if (!option) {
      displayLabel = formatMessage({ id: 'domain.root' });
    }
    return <div className={styles.activeItem}>{displayLabel}</div>;
  };

  return (
    <div className={styles.main}>
      <DomainDropdown
        colony={colony}
        name={name}
        renderActiveOptionFn={renderActiveOption}
        filterOptionsFn={filterDomains}
        onDomainChange={onDomainChange}
        showAllDomains={false}
        showDescription={false}
        disabled={disabled}
      />
    </div>
  );
};

MotionDomainSelect.displayName = displayName;

export default MotionDomainSelect;
