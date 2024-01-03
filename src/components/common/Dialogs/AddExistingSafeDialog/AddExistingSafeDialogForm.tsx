import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { defineMessages } from 'react-intl';

import { DialogSection } from '~shared/Dialog';
import Heading from '~shared/Heading';

import CheckSafe from './CheckSafe';
import ConfirmSafe from './ConfirmSafe';
import ConnectSafe from './ConnectSafe';
import { AddExistingSafeProps, NetworkOption } from './types';

import styles from './AddExistingSafeDialogForm.css';

const displayName = 'common.AddExistingSafeDialog.AddExistingSafeDialogForm';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Adding a Safe',
  },
});

const AddExistingSafeDialogForm = ({
  networkOptions,
  loadingModuleState,
  stepIndex,
  setStepIndex,
  ...props
}: AddExistingSafeProps) => {
  const { watch } = useFormContext();
  const { chainId } = watch();
  const [selectedChain, setSelectedChain] = useState<NetworkOption>(
    // chainId's initial value is set from networkOptions, therefore will return
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    networkOptions.find((options) => options.value === chainId)!,
  );

  const renderStep = () => {
    switch (stepIndex) {
      case 1:
        return (
          <CheckSafe
            {...props}
            networkOptions={networkOptions}
            setStepIndex={setStepIndex}
            loadingModuleState={loadingModuleState}
            selectedChain={selectedChain}
            setSelectedChain={setSelectedChain}
          />
        );
      case 2:
        return (
          <ConnectSafe
            {...props}
            setStepIndex={setStepIndex}
            loadingModuleState={loadingModuleState}
          />
        );
      case 3:
        return <ConfirmSafe setStepIndex={setStepIndex} />;
      default:
        return null;
    }
  };
  return (
    <div className={styles.main}>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.headingContainer}>
          <Heading
            appearance={{ size: 'medium', margin: 'none', theme: 'dark' }}
            text={MSG.title}
          />
        </div>
      </DialogSection>
      {renderStep()}
    </div>
  );
};

AddExistingSafeDialogForm.displayName = displayName;

export default AddExistingSafeDialogForm;
