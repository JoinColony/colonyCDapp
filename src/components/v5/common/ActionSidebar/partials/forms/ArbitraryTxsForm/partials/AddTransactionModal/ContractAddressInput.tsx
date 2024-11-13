import { isAddress } from 'ethers/lib/utils';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { formatText } from '~utils/intl.ts';
import FormInput from '~v5/common/Fields/InputBase/FormInput.tsx';

import { validateContractAddress } from './consts.tsx';
import { MSG } from './translation.ts';

export const ContractAddressInput = () => {
  const { watch, setError, setValue, clearErrors, trigger } = useFormContext();

  const contractAddressField = watch('contractAddress');

  const [serverError, setServerError] = useState('');

  useEffect(() => {
    setValue('jsonAbi', '');
    if (isAddress(contractAddressField)) {
      getABIFromContractAddress(contractAddressField);
    } else {
      setError('contractAddress', {
        type: 'custom',
        message: formatText(MSG.contractAddressError),
      });
    }

    async function getABIFromContractAddress(contractAddress: string) {
      const response = await fetch(
        `https://api.arbiscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${import.meta.env.ARBISCAN_API}`,
      ).then((result) => result.json());

      if (response.status === '0') {
        setServerError(response.result);
      } else {
        setServerError('');
        setValue('jsonAbi', response.result);
        trigger('jsonAbi');
      }
    }
  }, [contractAddressField, setError, setValue, clearErrors, trigger]);

  return (
    <FormInput
      name="contractAddress"
      label={formatText(MSG.contractAddressField)}
      placeholder={formatText(MSG.contractAddressPlaceholder)}
      error={serverError || undefined}
      registerOptions={{
        validate: validateContractAddress,
      }}
    />
  );
};
