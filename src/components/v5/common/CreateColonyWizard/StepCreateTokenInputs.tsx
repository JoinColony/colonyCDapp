import React from 'react';
import { useFormContext } from 'react-hook-form';
import { defineMessages, useIntl } from 'react-intl';

import Icon from '~shared/Icon';
import Input from '~v5/common/Fields/Input';

import AvatarUploader from '../AvatarUploader';

const displayName = 'common.CreateColonyWizard.StepCreateTokenInputs';

interface StepCreateTokenInputsProps {
  wizardTokenName: string;
  wizardTokenSymbol: string;
}

const MAX_TOKEN_NAME = 30;
const MAX_TOKEN_SYMBOL = 5;

const MSG = defineMessages({
  heading: {
    id: `${displayName}.heading`,
    defaultMessage: 'Your Colony’s native token',
  },
  description: {
    id: `${displayName}.description`,
    defaultMessage:
      'Your native token is your organization’s unit of ownership, and powers key features within your Colony.{br}{br}Tokens are initially locked and not transferable by recipients. You must unlock your token if you wish it to become tradable.',
  },
  create: {
    id: `${displayName}.create`,
    defaultMessage: 'Create a new token',
  },
  select: {
    id: `${displayName}.select`,
    defaultMessage: 'Use an existing token',
  },
  tokenName: {
    id: `${displayName}.tokenName`,
    defaultMessage: 'Token name',
  },
  tokenSymbol: {
    id: `${displayName}.tokenSymbol`,
    defaultMessage: 'Token symbol',
  },
  tokenLogo: {
    id: `${displayName}.tokenLogo`,
    defaultMessage: 'Token logo (Optional)',
  },
  tokenDescription: {
    id: `${displayName}.tokenDescription`,
    defaultMessage:
      'The token logo will only exist on Colony and can be changed at anytime.',
  },
});

const StepCreateTokenInputs = ({
  wizardTokenName,
  wizardTokenSymbol,
}: StepCreateTokenInputsProps) => {
  const {
    register,
    formState: { errors, isSubmitting },
  } = useFormContext();
  const { formatMessage } = useIntl();

  const tokenNameError = errors.tokenName?.message as string | undefined;
  const tokenSymbolError = errors.tokenSymbol?.message as string | undefined;

  return (
    <>
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
          labelMessage={MSG.tokenName}
        />
        <Input
          name="tokenSymbol"
          register={register}
          isError={!!tokenSymbolError}
          customErrorMessage={tokenSymbolError}
          className="text-md border-gray-300 uppercase"
          maxCharNumber={MAX_TOKEN_SYMBOL}
          isDisabled={isSubmitting}
          defaultValue={wizardTokenSymbol}
          labelMessage={MSG.tokenSymbol}
        />
      </div>
      <p className="text-1 pb-1">{formatMessage(MSG.tokenLogo)}</p>
      <p className="text-sm text-gray-600 pb-2">
        {formatMessage(MSG.tokenDescription)}
      </p>
      <AvatarUploader
        avatarPlaceholder={
          <Icon name="circle-plus" appearance={{ size: 'medium' }} />
        }
        fileOptions={{
          fileFormat: ['.PNG', '.JPG', '.SVG'],
          fileDimension: '250x250px',
          fileSize: '1MB',
        }}
      />
    </>
  );
};

StepCreateTokenInputs.displayName = displayName;
export default StepCreateTokenInputs;
