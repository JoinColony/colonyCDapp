import { isAddress } from 'ethers/lib/utils';
import { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import useGetCurrentNetwork from '~hooks/useGetCurrentNetwork.ts';
import { formatText } from '~utils/intl.ts';
import { fetchContractABI } from '~utils/safes/index.ts';

import { MSG } from './translation.ts';

export const useGenerateABI = ({ setContractAbiLoading }) => {
  const { watch, setValue, trigger } = useFormContext();

  const [contractAddressServerError, setContractAddressServerError] =
    useState('');
  const networkInfo = useGetCurrentNetwork();

  const [isJsonAbiFormatted, setIsJsonAbiFormatted] = useState(false);
  const [showJsonAbiEditWarning, setShowJsonAbiEditWarning] = useState(false);

  const getABIFromContractAddress = useCallback(
    async (contractAddress: string) => {
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
          setContractAddressServerError('');
          setValue('jsonAbi', response.result);
          trigger('jsonAbi'); // Trigger validation to clear previous errors
          setShowJsonAbiEditWarning(true);
        } else {
          const errorMessage = response?.result;
          if (errorMessage) {
            if (errorMessage.toLowerCase().includes('not verified')) {
              setContractAddressServerError(
                formatText(MSG.contractAddressServerError),
              );
            } else {
              setContractAddressServerError(errorMessage);
            }
          } else {
            setContractAddressServerError(formatText({ id: 'error.message' }));
          }
        }
      } catch (e) {
        setContractAbiLoading(false);
        setContractAddressServerError(e.message);
        // eslint-disable-next-line no-console
        console.log(e);
      }
    },
    [networkInfo?.chainId, setContractAbiLoading, setValue, trigger],
  );

  useEffect(() => {
    const { unsubscribe } = watch(
      ({ contractAddress: contractAddressField }, { name }) => {
        if (name === 'contractAddress' && isAddress(contractAddressField)) {
          getABIFromContractAddress(contractAddressField);

          // Reset jsonAbi state if contractAddress is updated
          // jsonAbi will be filled with data after a successful ABI response
          setValue('jsonAbi', '');
          setIsJsonAbiFormatted(false);
        }
      },
    );

    return () => unsubscribe();
  }, [
    watch,
    networkInfo?.chainId,
    setContractAbiLoading,
    setValue,
    trigger,
    getABIFromContractAddress,
  ]);

  const jsonAbiField = watch('jsonAbi');
  const contractAddressField = watch('contractAddress');

  useEffect(() => {
    // Initial ABI loading in case there is no ABI after REDO action
    if (
      contractAddressField &&
      isAddress(contractAddressField) &&
      !jsonAbiField
    ) {
      getABIFromContractAddress(contractAddressField);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleJsonFormat = useCallback(() => {
    try {
      const parsedJson = JSON.parse(jsonAbiField);
      let newValue: string;

      if (isJsonAbiFormatted) {
        newValue = JSON.stringify(parsedJson);
      } else {
        newValue = JSON.stringify(parsedJson, null, 2);
      }

      setValue('jsonAbi', newValue);
      setIsJsonAbiFormatted((val) => !val);
    } catch (error) {
      console.error('Invalid JSON:', error);
    }
  }, [jsonAbiField, isJsonAbiFormatted, setValue]);

  const toggleShowJsonAbiEditWarningOff = () => {
    setShowJsonAbiEditWarning(false);
  };

  return {
    contractAddressServerError,
    isJsonAbiFormatted,
    showJsonAbiEditWarning,
    toggleJsonFormat,
    toggleShowJsonAbiEditWarningOff,
  };
};
