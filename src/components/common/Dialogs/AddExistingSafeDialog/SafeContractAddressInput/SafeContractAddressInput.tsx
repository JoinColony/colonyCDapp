import React, { useEffect } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useFormContext } from 'react-hook-form';

import {
  HookFormInput as Input,
  SelectOption,
  HookFormInputStatus as InputStatus,
  InputLabel,
} from '~shared/Fields';
import { FETCH_ABORTED } from '~constants';
import { Message } from '~types';
import Avatar from '~shared/Avatar';
import { isAddress } from '~utils/web3';

import { StatusText } from '../types';

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
  loadingSafeState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

const SafeContractAddressInput = ({
  selectedChain,
  loadingSafeState,
}: Props) => {
  const {
    watch,
    formState: { errors, dirtyFields, isSubmitting, isValidating },
    trigger,
  } = useFormContext();
  const { contractAddress } = watch();
  const { formatMessage } = useIntl();
  const contractAddressError = errors.contractAddress;
  const contractAddressDirtied = dirtyFields.contractAddress;

  const [isLoadingSafe, setIsLoadingSafe] = loadingSafeState;

  useEffect(() => {
    if (!isLoadingSafe && contractAddressDirtied) {
      trigger('contractAddress');
    }
  }, [isLoadingSafe, trigger, contractAddressDirtied]);

  const getStatusText = (): StatusText | Record<string, never> => {
    const isValidAddress =
      !contractAddressError &&
      contractAddressDirtied &&
      isAddress(contractAddress);

    if (isLoadingSafe) {
      return { status: MSG.safeLoading };
    }

    if (!isValidAddress || isValidating) {
      return {};
    }

    return {
      status: MSG.safeCheck,
      statusValues: {
        selectedChain: selectedChain.label.toString(),
      },
    };
  };

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
        onChange={(e) => {
          if (isAddress(e.target.value)) {
            setIsLoadingSafe(true);
          }
        }}
        onBlur={(e) => {
          if (!contractAddressDirtied && isAddress(e.target.value)) {
            setIsLoadingSafe(true);
          }
        }}
      />
      <InputStatus
        appearance={{ colorSchema: 'grey', theme: 'fat' }}
        touched={contractAddressDirtied}
        error={
          contractAddressError?.message !== FETCH_ABORTED
            ? (contractAddressError?.message as Message | undefined)
            : undefined
        }
        {...getStatusText()}
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
