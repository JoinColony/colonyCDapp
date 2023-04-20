import React from 'react';
import { defineMessages } from 'react-intl';
import { useFormContext } from 'react-hook-form';

import ColorSelect from '~shared/ColorSelect';

import { HookFormInput as Input, HookFormSelect as Select, SelectOption } from '~shared/Fields';

import styles from './DomainNameAndColorInputGroup.css';

const displayName = 'DomainNameAndColorInputGroup';

const MSG = defineMessages({
  domainNameLabel: {
    id: `${displayName}.name`,
    defaultMessage: 'Team name',
  },
  selectTeamLabel: {
    id: `${displayName}.seletTeamLabel`,
    defaultMessage: 'Select team',
  },
});

interface Props {
  disabled: boolean;
  isCreatingDomain?: boolean;
  onSelectDomainChange?: (val: any) => void;
  domainOptions?: SelectOption[];
}

const DomainNameAndColorInputGroup = ({
  isCreatingDomain = false,
  disabled,
  onSelectDomainChange,
  domainOptions = [],
}: Props) => {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <div className={styles.nameAndColorContainer}>
      <div className={styles.domainName}>
        {isCreatingDomain ? (
          <Input
            label={MSG.domainNameLabel}
            name="teamName"
            appearance={{ colorSchema: 'grey', theme: 'fat' }}
            disabled={disabled}
            maxLength={20}
            dataTest="domainNameInput"
          />
        ) : (
          <Select
            options={domainOptions}
            label={MSG.selectTeamLabel}
            onChange={onSelectDomainChange}
            name="domainId"
            appearance={{ theme: 'grey', width: 'fluid' }}
            disabled={isSubmitting || domainOptions.length === 0}
            dataTest="domainIdSelector"
            itemDataTest="domainIdItem"
          />
        )}
      </div>
      <ColorSelect appearance={{ alignOptions: 'right' }} disabled={disabled} name="domainColor" />
    </div>
  );
};

export default DomainNameAndColorInputGroup;
