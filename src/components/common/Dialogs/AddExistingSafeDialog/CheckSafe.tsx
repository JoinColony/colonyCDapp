import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import classnames from 'classnames';
import { useFormContext } from 'react-hook-form';

import Button from '~shared/Button';
import { DialogSection } from '~shared/Dialog';
import { HookFormSelect as Select, SelectOption } from '~shared/Fields';
import { isAddress } from '~utils/web3';

import { AddExistingSafeProps } from './index';
import SetupSafeCallout from './SetupSafeCallout';
import SafeContractAddressInput from './SafeContractAddressInput';

import styles from './AddExistingSafeDialogForm.css';

const displayName =
  'common.AddExistingSafeDialog.AddExistingSafeDialogForm.CheckSafe';

const MSG = defineMessages({
  subtitle: {
    id: `${displayName}.subtitle`,
    defaultMessage: 'Step 1: Check for the Safe',
  },
  chain: {
    id: `${displayName}.chain`,
    defaultMessage: 'Select Chain',
  },
});

interface CheckSafeProps extends Omit<AddExistingSafeProps, 'stepIndex'> {
  selectedChain: SelectOption;
  setSelectedChain: React.Dispatch<React.SetStateAction<SelectOption>>;
}

const CheckSafe = ({
  back,
  networkOptions,
  setStepIndex,
  selectedChain,
  setSelectedChain,
  loadingState,
}: CheckSafeProps) => {
  const {
    watch,
    formState: { errors, dirtyFields, isSubmitting },
    trigger,
    clearErrors,
  } = useFormContext();
  const { contractAddress, moduleContractAddress } = watch();
  const contractAddressError = errors.contractAddress;
  const contractAddressDirtied = dirtyFields.contractAddress;

  const [[isLoadingSafe, setIsLoadingSafe], [, setIsLoadingModule]] =
    loadingState;

  const handleNetworkChange = (fromNetworkValue: number) => {
    const selectedNetwork = networkOptions.find(
      (option) => option.value === fromNetworkValue,
    );
    if (selectedNetwork) {
      setSelectedChain(selectedNetwork);
    }
    if (isAddress(contractAddress) && contractAddressDirtied) {
      if (contractAddressError?.message) {
        clearErrors('contractAddress');
      }
      setIsLoadingSafe(true);
    }
  };

  const handleNextStep = () => {
    setStepIndex((step) => step + 1);
    if (moduleContractAddress) {
      setIsLoadingModule(true);
      // Don't run validation until step has increased.
      setTimeout(() => trigger('moduleContractAddress'), 0);
    }
  };

  /*
   * Checks if Contract Address and Chain Id fields are error-free.
   */
  const isCheckSafeValid =
    contractAddressDirtied &&
    !Object.keys(errors).filter(
      (key) => key === 'contractAddress' || key === 'chainId',
    ).length;

  return (
    <>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={classnames(styles.subtitle, styles.step1Subtitle)}>
          <FormattedMessage {...MSG.subtitle} />
        </div>
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <SetupSafeCallout />
      </DialogSection>
      <DialogSection>
        <div className={styles.chainSelect}>
          <Select
            options={networkOptions}
            label={MSG.chain}
            name="chainId"
            appearance={{ theme: 'grey', width: 'fluid' }}
            disabled={isSubmitting}
            onChange={handleNetworkChange}
          />
        </div>
        <SafeContractAddressInput
          selectedChain={selectedChain}
          loadingSafeState={loadingState[0]}
        />
      </DialogSection>
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <Button
          appearance={{ theme: 'secondary', size: 'large' }}
          onClick={back}
          text={{ id: 'button.back' }}
        />
        <Button
          appearance={{ theme: 'primary', size: 'large' }}
          onClick={handleNextStep}
          text={{ id: 'button.next' }}
          type="submit"
          loading={isSubmitting}
          disabled={
            !isCheckSafeValid ||
            isSubmitting ||
            !dirtyFields.contra ||
            isLoadingSafe
          }
          style={{ width: styles.wideButton }}
        />
      </DialogSection>
    </>
  );
};

CheckSafe.displayName = displayName;

export default CheckSafe;
