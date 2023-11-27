import React, { useEffect, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useFormContext } from 'react-hook-form';

import { Input, SelectOption, InputStatus, InputLabel } from '~shared/Fields';
import { FETCH_ABORTED } from '~constants';
import { Message } from '~types';
import Avatar from '~shared/Avatar';

import styles from './SafeContractAddressInput.css';

const displayName =
  'common.AddExistingSafeDialog.AddExistingSafeDialogForm.CheckSafe.SafeContractAddressInput';

const MSG = defineMessages({
  contract: {
    id: `${displayName}.contract`,
    defaultMessage: 'Add Safe contract',
  },
  safeLoading: {
    id: `${displayName}.safeLoading`,
    defaultMessage: 'Loading Safe details...',
  },
  safeCheck: {
    id: `${displayName}.safeCheck`,
    defaultMessage: `Safe found on {selectedChain}`,
  },
  safe: {
    id: `${displayName}.safe`,
    defaultMessage: 'Safe',
  },
});

interface Props {
  selectedChain: SelectOption;
  setIsLoadingSafe: React.Dispatch<React.SetStateAction<boolean>>;
}

const SafeContractAddressInput = ({
  selectedChain,
  setIsLoadingSafe,
}: Props) => {
  const {
    watch,
    formState: { errors, dirtyFields, isSubmitting },
    trigger,
    clearErrors,
  } = useFormContext();
  const { contractAddress, chainId } = watch();
  const { formatMessage } = useIntl();
  const contractAddressError = errors.contractAddress;
  const contractAddressDirtied = dirtyFields.contractAddress;

  const [statusText, setStatusText] = useState({});

  useEffect(() => {
    const validate = async () => {
      if (!contractAddressDirtied) {
        return;
      }
      setIsLoadingSafe(true);
      setStatusText({ status: MSG.safeLoading });
      clearErrors('contractAddress');
      const validation = await trigger('contractAddress');
      if (validation) {
        setStatusText({
          status: MSG.safeCheck,
          statusValues: {
            selectedChain: selectedChain.label.toString(),
          },
        });
      } else {
        setStatusText({});
      }
      setIsLoadingSafe(false);
    };

    validate();
  }, [
    contractAddress,
    chainId,
    contractAddressDirtied,
    trigger,
    selectedChain,
    clearErrors,
    setIsLoadingSafe,
  ]);

  return (
    <div className={styles.contractAddressContainer}>
      <InputLabel
        appearance={{ colorSchema: 'grey', theme: 'fat' }}
        label={MSG.contract}
      />
      <Input
        name="contractAddress"
        appearance={{ colorSchema: 'grey', theme: 'fat' }}
        disabled={isSubmitting}
        elementOnly
      />
      <InputStatus
        appearance={{ colorSchema: 'grey', theme: 'fat' }}
        touched={contractAddressDirtied}
        error={
          contractAddressError?.message !== FETCH_ABORTED
            ? (contractAddressError?.message as Message | undefined)
            : undefined
        }
        {...statusText}
      />
      <Avatar
        seed={contractAddress}
        placeholderIcon="at-sign-circle"
        title={formatMessage(MSG.safe)}
        size="xs"
      />
    </div>
  );
};

SafeContractAddressInput.displayName = displayName;

export default SafeContractAddressInput;
