import React, { type FC } from 'react';

import { formatText } from '~utils/intl.ts';
import FormInput from '~v5/common/Fields/InputBase/FormInput.tsx';

import { validateContractAddress } from './consts.ts';
import { MSG } from './translation.ts';

interface ContractAddressInputProps {
  contractAbiLoading?: boolean;
}
export const ContractAddressInput: FC<ContractAddressInputProps> = ({
  contractAbiLoading,
}) => {
  return (
    <div className="relative">
      <FormInput
        name="contractAddress"
        label={formatText(MSG.contractAddressField)}
        placeholder={formatText(MSG.contractAddressPlaceholder)}
        loading={contractAbiLoading}
        registerOptions={{
          validate: validateContractAddress,
        }}
      />
    </div>
  );
};
