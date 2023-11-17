import React from 'react';
import { useFormContext } from 'react-hook-form';
import { defineMessages, useIntl } from 'react-intl';

import Input from '~v5/common/Fields/Input';
import Avatar from '~v5/shared/Avatar';

import AvatarUploader from '../AvatarUploader';
import { UseAvatarUploaderProps } from '../AvatarUploader/hooks';

import { MAX_TOKEN_NAME, MAX_TOKEN_SYMBOL } from './validation';

const displayName = 'common.CreateColonyWizard.StepCreateTokenInputs';

interface StepCreateTokenInputsProps {
  wizardTokenName: string;
  wizardTokenSymbol: string;
}

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
    setValue,
    watch,
    formState: { errors, isSubmitting, submitCount },
  } = useFormContext();
  const { formatMessage } = useIntl();

  const tokenNameError = errors.tokenName?.message as string | undefined;
  const showTokenNameError =
    errors.tokenName?.type === 'required' && submitCount === 0
      ? false
      : tokenNameError;
  const tokenSymbolError = errors.tokenSymbol?.message as string | undefined;
  const showTokenSymbolError =
    errors.tokenSymbol?.type === 'required' && submitCount === 0
      ? false
      : tokenSymbolError;

  const tokenAvatarUrl = watch('tokenAvatar');

  const updateFn: UseAvatarUploaderProps['updateFn'] = async (
    avatar,
    thumbnail,
    setProgress,
  ) => {
    setProgress(0);

    setValue('tokenAvatar', avatar);
    setValue('tokenThumbnail', thumbnail);

    if (avatar === null) {
      return;
    }

    setProgress(100);
  };

  return (
    <>
      <div className="flex gap-6">
        <Input
          name="tokenName"
          register={register}
          isError={!!showTokenNameError}
          customErrorMessage={tokenNameError}
          className="text-md border-gray-300"
          maxCharNumber={MAX_TOKEN_NAME}
          isDisabled={isSubmitting}
          defaultValue={wizardTokenName}
          labelMessage={MSG.tokenName}
          errorMaxChar
        />
        <Input
          name="tokenSymbol"
          register={register}
          isError={!!showTokenSymbolError}
          customErrorMessage={tokenSymbolError}
          className="text-md border-gray-300 uppercase"
          maxCharNumber={MAX_TOKEN_SYMBOL}
          isDisabled={isSubmitting}
          defaultValue={wizardTokenSymbol}
          labelMessage={MSG.tokenSymbol}
          errorMaxChar
        />
      </div>
      <p className="text-1 pb-1">{formatMessage(MSG.tokenLogo)}</p>
      <p className="text-sm text-gray-600 pb-2">
        {formatMessage(MSG.tokenDescription)}
      </p>
      <AvatarUploader
        avatarPlaceholder={
          <Avatar
            notSet={!tokenAvatarUrl}
            placeholderIcon="grey-circle-plus"
            size="ms"
            avatar={tokenAvatarUrl}
          />
        }
        fileOptions={{
          fileFormat: ['.PNG', '.JPG', '.SVG'],
          fileDimension: '250x250px',
          fileSize: '1MB',
        }}
        updateFn={updateFn}
        useSucessState={false}
        showUploaderText={false}
      />
    </>
  );
};

StepCreateTokenInputs.displayName = displayName;
export default StepCreateTokenInputs;
