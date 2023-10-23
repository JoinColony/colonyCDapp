import React from 'react';
import { useFormContext } from 'react-hook-form';

import Input from '~v5/common/Fields/Input';

const displayName = 'common.CreateColonyWizard.StepCreateTokenInputs';

interface StepCreateTokenInputsProps {
  wizardTokenName: string;
  wizardTokenSymbol: string;
}

const MAX_TOKEN_NAME = 30;
const MAX_TOKEN_SYMBOL = 5;

const StepCreateTokenInputs = ({
  wizardTokenName,
  wizardTokenSymbol,
}: StepCreateTokenInputsProps) => {
  const {
    register,
    formState: { errors, isSubmitting },
  } = useFormContext();

  const tokenNameError = errors.tokenName?.message as string | undefined;
  const tokenSymbolError = errors.tokenSymbol?.message as string | undefined;

  return (
    <div className="flex gap-6">
      <Input
        name="tokenName"
        register={register}
        isError={!!tokenNameError}
        customErrorMessage={tokenNameError}
        className="text-md border-gray-300"
        maxCharNumber={MAX_TOKEN_NAME}
        isDisabled={isSubmitting}
        defaultValue={wizardTokenName}
        labelMessage={{ id: 'createColonyWizard.step.nativeToken.tokenName' }}
      />
      <Input
        name="tokenSymbol"
        register={register}
        isError={!!tokenSymbolError}
        customErrorMessage={tokenSymbolError}
        className="text-md border-gray-300"
        maxCharNumber={MAX_TOKEN_SYMBOL}
        isDisabled={isSubmitting}
        defaultValue={wizardTokenSymbol}
        labelMessage={{ id: 'createColonyWizard.step.nativeToken.tokenSymbol' }}
      />
    </div>
  );
};

StepCreateTokenInputs.displayName = displayName;
export default StepCreateTokenInputs;
