import React, { useState } from 'react';

import { ContractAddressInput } from './ContractAddressInput.tsx';
import { DynamicInputs } from './DynamicInputs.tsx';
import { JsonAbiInput } from './JsonAbiInput.tsx';
import { useGenerateABI } from './useGenerateABI.ts';

export const AddTransactionForm = () => {
  const [contractAbiLoading, setContractAbiLoading] = useState(false);

  const {
    serverError,
    isJsonAbiFormatted,
    showJsonAbiEditWarning,
    toggleJsonFormat,
    toggleShowJsonAbiEditWarningOff,
  } = useGenerateABI({ setContractAbiLoading });
  return (
    <>
      <ContractAddressInput
        contractAbiLoading={contractAbiLoading}
        serverError={serverError}
      />
      <JsonAbiInput
        loading={contractAbiLoading}
        toggleJsonFormat={toggleJsonFormat}
        isFormatted={isJsonAbiFormatted}
        showEditWarning={showJsonAbiEditWarning}
        toggleShowEditWarningOff={toggleShowJsonAbiEditWarningOff}
      />
      <DynamicInputs />
    </>
  );
};
