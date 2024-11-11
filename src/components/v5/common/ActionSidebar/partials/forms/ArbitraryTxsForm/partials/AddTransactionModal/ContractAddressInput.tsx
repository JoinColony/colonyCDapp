import { isAddress } from 'ethers/lib/utils';
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { formatText } from '~utils/intl.ts';
import FormInput from '~v5/common/Fields/InputBase/FormInput.tsx';

import { MSG } from './translation.ts';

export const ContractAddressInput = () => {
  const {
    watch,
    setError,
    setValue,
    formState: { errors },
  } = useFormContext();

  // @TODO: remove console log here
  // eslint-disable-next-line no-console
  console.log('errors', errors);
  const contractAddressField = watch('contractAddress');

  useEffect(() => {
    if (isAddress(contractAddressField)) {
      getABIFromContractAddress(contractAddressField);
    }

    async function getABIFromContractAddress(contractAddress: string) {
      const response = await fetch(
        `https://api.arbiscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${import.meta.env.ARBISCAN_API}`,
      ).then((result) => result.json());

      if (response.status === '0') {
        // @TODO: remove console log here
        // eslint-disable-next-line no-console
        console.log(response);
        setError('contractAddress', {
          type: 'custom',
          message: response.result,
        });
      } else {
        setValue('jsonAbi', response.result);
      }
    }
  }, [contractAddressField, setError, setValue]);

  return (
    <FormInput
      name="contractAddress"
      label={formatText(MSG.contractAddressField)}
      placeholder={formatText(MSG.contractAddressPlaceholder)}
    />
  );
};
