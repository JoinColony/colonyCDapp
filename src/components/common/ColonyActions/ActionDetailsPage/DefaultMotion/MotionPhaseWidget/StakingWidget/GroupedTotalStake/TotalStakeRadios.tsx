import React from 'react';

// import { CustomRadioGroup } from '~shared/Fields';
// import { useTotalStakeRadios } from '~hooks';

import styles from './TotalStakeRadios.css';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.StakingWidget.TotalStakeRadios';

const TotalStakeRadios = () => {
  // const { radioConfig, stakeSide } = useTotalStakeRadios();

  return (
    <div className={styles.main}>
      {/* <CustomRadioGroup
        name="stakeSide"
        currentlyCheckedValue={stakeSide}
        options={radioConfig}
        appearance={{ direction: 'vertical' }}
      /> */}
    </div>
  );
};

TotalStakeRadios.displayName = displayName;

export default TotalStakeRadios;
