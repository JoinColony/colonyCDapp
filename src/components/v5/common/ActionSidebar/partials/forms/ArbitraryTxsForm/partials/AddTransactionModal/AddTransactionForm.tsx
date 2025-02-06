import React, { useState } from 'react';

import { formatText } from '~utils/intl.ts';

import { ContractAddressInput } from './ContractAddressInput.tsx';
import { DynamicInputs } from './DynamicInputs.tsx';
import { JsonAbiInput } from './JsonAbiInput.tsx';
import { MSG } from './translation.ts';
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
          <span className="text-sm">
            <span className="font-medium">
              {formatText(MSG.contractAddressServerErrorNote)}{' '}
            </span>
            {contractAddressServerError}
          </span>
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
