import React from 'react';

import DomainFundSelector from '~common/Dialogs/DomainFundSelectorSection/DomainFundSelector';
import { Colony } from '~types';

import styles from '../ExpenditureForm.module.css';

interface ExpenditureDomainSelectorProps {
  colony: Colony;
}

const ExpenditureDomainSelector = ({
  colony,
}: ExpenditureDomainSelectorProps) => {
  return (
    <div className={styles.domainSelection}>
      <DomainFundSelector
        colony={colony}
        label="Create in"
        name="createInDomainId"
        hideBalance
      />
      <DomainFundSelector
        colony={colony}
        label="Fund from"
        name="fundFromDomainId"
        hideBalance
      />
    </div>
  );
};

export default ExpenditureDomainSelector;
