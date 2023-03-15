import React from 'react';
import { defineMessages } from 'react-intl';
import { useFormContext } from 'react-hook-form';
import classNames from 'classnames';

import Icon from '~shared/Icon';
import { Colony } from '~types';

import DomainFundSelector from './DomainFundSelector';

import styles from './DomainFundSelector.css';

const displayName = 'DomainFundSelectorSection';

const MSG = defineMessages({
  from: {
    id: `${displayName}.from`,
    defaultMessage: 'From',
  },
  to: {
    id: `${displayName}.to`,
    defaultMessage: 'To',
  },
  transferIconTitle: {
    id: `${displayName}.transferIconTitle`,
    defaultMessage: 'Transfer',
  },
});

interface Props {
  colony: Colony;
  disabled?: boolean;
  transferBetweenDomains?: boolean;
}

const DomainFundSelectorSection = ({
  colony,
  transferBetweenDomains,
  disabled,
}: Props) => {
  const { watch, setValue } = useFormContext();
  const { motionDomainId } = watch();

  const handleFromDomainChange = (fromDomainValue) => {
    if (motionDomainId !== fromDomainValue) {
      setValue('motionDomainId', fromDomainValue);
    }
  };

  return (
    <div
      className={classNames(styles.selectDomainContainer, {
        [styles.selectBetweenDomainsContainer]: transferBetweenDomains,
      })}
    >
      <DomainFundSelector
        name="fromDomain"
        label={MSG.from}
        colony={colony}
        disabled={disabled}
        onChange={handleFromDomainChange}
      />
      {transferBetweenDomains && (
        <>
          <Icon
            className={styles.transferIcon}
            name="circle-arrow-back"
            title={MSG.transferIconTitle}
            appearance={{ size: 'medium' }}
          />
          <DomainFundSelector
            name="toDomain"
            label={MSG.to}
            colony={colony}
            disabled={disabled}
          />
        </>
      )}
    </div>
  );
};

DomainFundSelectorSection.displayName = displayName;

export default DomainFundSelectorSection;
