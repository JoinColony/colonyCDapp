import React from 'react';
import { Id } from '@colony/colony-js';
import { defineMessages, MessageDescriptor } from 'react-intl';

import { SelectOption } from '~shared/Fields';
import DomainDropdown from '~shared/DomainDropdown';
import { formatText } from '~utils/intl';
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
  const renderActiveOption = (
    option: SelectOption | undefined,
    label: string,
  ) => {
    /*
     * @NOTE This is done so that the active item is displayed as `Root/Current Domain`
     * when a subdomain is selected, otherwise show `Root`
     */
    const baseDropdownLabel = `${formatText(
      dropdownLabel || MSG.createDomain,
    )} ${formatText({ id: 'domain.root' })}`;
    const displayLabel =
      (option?.value || Id.RootDomain) === Id.RootDomain
        ? baseDropdownLabel
        : `${baseDropdownLabel}/${label}`;
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
