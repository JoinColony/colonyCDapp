import React, { useState } from 'react';
import { defineMessages } from 'react-intl';
import { useFormContext } from 'react-hook-form';

import { DialogSection } from '~shared/Dialog';
import Heading from '~shared/Heading';
// import { ColonySafe } from '~data/index';
import { Address } from '~types';

import { NetworkOption, SafeContract } from './helpers';
import {
  CheckSafe,
  // ConnectSafe,
  // ConfirmSafe,
} from './index';

import styles from './AddExistingSafeDialogForm.css';

export type SafeData =
  | SafeContract
  | undefined
  | null
  | Record<string, never>
  | 'alreadyExists';

const displayName = 'common.AddExistingSafeDialog.AddExistingSafeDialogForm';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Adding a Safe',
  },
});

export interface AddExistingSafeProps {
  back: () => void;
  networkOptions: NetworkOption[];
  colonySafes: Array<any>; // ColonySafe[];
  colonyAddress: Address;
  loadingModuleState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  loadingSafeState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  stepIndex: number;
  setStepIndex: React.Dispatch<React.SetStateAction<number>>;
}

const AddExistingSafeDialogForm = ({
  networkOptions,
  loadingModuleState,
  loadingSafeState,
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
            loadingSafeState={loadingSafeState}
            selectedChain={selectedChain}
            setSelectedChain={setSelectedChain}
          />
        );
      // case 2:
      //   return (
      //     <ConnectSafe
      //       {...props}
      //       values={values}
      //       setStepIndex={setStepIndex}
      //       safeAddress={contractAddress}
      //       loadingState={loadingState[1]}
      //     />
      //   );
      // case 3:
      //   return (
      //     <ConfirmSafe {...props} values={values} setStepIndex={setStepIndex} />
      //   );
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
