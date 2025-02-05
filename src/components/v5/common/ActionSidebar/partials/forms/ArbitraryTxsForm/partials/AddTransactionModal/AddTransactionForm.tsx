import React, { useState } from 'react';

import { ContractAddressInput } from './ContractAddressInput.tsx';
import { DynamicInputs } from './DynamicInputs.tsx';
import { JsonAbiInput } from './JsonAbiInput.tsx';
import { useGenerateABI } from './useGenerateABI.ts';

export const AddTransactionForm = () => {
  const [contractAbiLoading, setContractAbiLoading] = useState(false);

  const {
    contractAddressServerError,
    isJsonAbiFormatted,
    showJsonAbiEditWarning,
    toggleJsonFormat,
    toggleShowJsonAbiEditWarningOff,
  } = useGenerateABI({ setContractAbiLoading });
  return (
    <>
      {contractAddressServerError && (
        <div className="flex rounded-md border border-warning-400 bg-warning-100 px-4 py-4.5 text-warning-400 break-word">
          <span className="text-sm">{contractAddressServerError}</span>
        </div>
      )}
      <ContractAddressInput contractAbiLoading={contractAbiLoading} />
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
