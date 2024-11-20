import { isAddress } from 'ethers/lib/utils';
import React, { type FC, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import useGetCurrentNetwork from '~hooks/useGetCurrentNetwork.ts';
import { formatText } from '~utils/intl.ts';
import { fetchContractABI } from '~utils/safes/getContractUsefulMethods.ts';
import FormInput from '~v5/common/Fields/InputBase/FormInput.tsx';

import { validateContractAddress } from './consts.ts';
import { MSG } from './translation.ts';

interface ContractAddressInputProps {
  contractAbiLoading?: boolean;
  setContractAbiLoading: (b: boolean) => void;
}
export const ContractAddressInput: FC<ContractAddressInputProps> = ({
  setContractAbiLoading,
  contractAbiLoading,
}) => {
  const { watch, setValue, trigger } = useFormContext();

  const [serverError, setServerError] = useState('');
  const networkInfo = useGetCurrentNetwork();

  useEffect(() => {
    const { unsubscribe } = watch(
      ({ contractAddress: contractAddressField }, { name }) => {
        if (name === 'contractAddress' && isAddress(contractAddressField)) {
          getABIFromContractAddress(contractAddressField);
        }
      },
    );

    async function getABIFromContractAddress(contractAddress: string) {
      if (!networkInfo?.chainId) {
        return;
      }
      try {
        setContractAbiLoading(true);
        const response = await fetchContractABI(
          contractAddress,
          networkInfo.chainId,
        );

        setContractAbiLoading(false);
        if (response.status === '1') {
          setServerError('');
          setValue('jsonAbi', response.result);
          trigger('jsonAbi'); // Trigger validation to clear previous errors
        } else {
          setServerError(
            response?.result ?? formatText({ id: 'error.message' }),
          );
        }
      } catch (e) {
        setContractAbiLoading(false);
        setServerError(e.message);
        // eslint-disable-next-line no-console
        console.log(e);
      }
    }

    return () => unsubscribe();
  }, [watch, networkInfo?.chainId, setContractAbiLoading, setValue, trigger]);

  return (
    <div className="relative">
      <FormInput
        name="contractAddress"
        label={formatText(MSG.contractAddressField)}
        placeholder={formatText(MSG.contractAddressPlaceholder)}
        error={serverError || undefined}
        loading={contractAbiLoading}
        registerOptions={{
          validate: validateContractAddress,
        }}
      />
    </div>
  );
};
