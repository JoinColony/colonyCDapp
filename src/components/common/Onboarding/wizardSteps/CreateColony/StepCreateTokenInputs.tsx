import { Image } from '@phosphor-icons/react';
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { defineMessages, useIntl } from 'react-intl';

import { ADDRESS_ZERO } from '~constants';
import { type UseAvatarUploaderProps } from '~v5/common/AvatarUploader/hooks.ts';
import AvatarUploader from '~v5/common/AvatarUploader/index.ts';
import Input from '~v5/common/Fields/Input/index.ts';
import { TokenAvatar } from '~v5/shared/TokenAvatar/TokenAvatar.tsx';

import { getInputError } from '../shared.ts';

import IconSuccessContent from './IconSuccessContent.tsx';
import { MAX_TOKEN_NAME, MAX_TOKEN_SYMBOL } from './validation.ts';

const displayName = 'common.CreateColonyWizard.StepCreateTokenInputs';

interface StepCreateTokenInputsProps {
  wizardTokenName: string;
  wizardTokenSymbol: string;
  wizardTokenAvatar: string;
}

const MSG = defineMessages({
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
      'The logo will only exist on Colony. A blockie will be generated if no logo is added in this step.',
  },
});

const StepCreateTokenInputs = ({
  wizardTokenName,
  wizardTokenSymbol,
  wizardTokenAvatar,
}: StepCreateTokenInputsProps) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors, isSubmitting, submitCount },
  } = useFormContext();
  const { formatMessage } = useIntl();

  const { error: tokenNameError, showError: showTokenNameError } =
    getInputError(errors, 'tokenName', submitCount);
  const { error: tokenSymbolError, showError: showTokenSymbolError } =
    getInputError(errors, 'tokenSymbol', submitCount);

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

  useEffect(() => {
    if (!watch('tokenAvatar') && wizardTokenAvatar) {
      setValue('tokenAvatar', wizardTokenAvatar);
    }
  }, [wizardTokenAvatar, setValue, watch]);

  const tokenAvatarUrl = watch('tokenAvatar');

  return (
    <>
      <div className="flex flex-col gap-6 pb-6 sm:flex-row">
        <div className="flex-1">
          <Input
            name="tokenName"
            register={register}
            isError={showTokenNameError}
            customErrorMessage={tokenNameError}
            className="border-gray-300 text-md"
            maxCharNumber={MAX_TOKEN_NAME}
            isDisabled={isSubmitting}
            defaultValue={wizardTokenName}
            labelMessage={MSG.tokenName}
            errorMaxChar
            shouldFocus
          />
        </div>
        <div className="flex-1">
          <Input
            name="tokenSymbol"
            register={register}
            isError={showTokenSymbolError}
            customErrorMessage={tokenSymbolError}
            className="border-gray-300 text-md uppercase"
            maxCharNumber={MAX_TOKEN_SYMBOL}
            isDisabled={isSubmitting}
            defaultValue={wizardTokenSymbol}
            labelMessage={MSG.tokenSymbol}
            errorMaxChar
          />
        </div>
      </div>
      <p className="pb-1 text-1">{formatMessage(MSG.tokenLogo)}</p>
      <p className="pb-2 text-sm text-gray-600">
        {formatMessage(MSG.tokenDescription)}
      </p>
      <AvatarUploader
        avatarSrc={tokenAvatarUrl}
        avatarPlaceholder={
          tokenAvatarUrl ? (
            <TokenAvatar
              size={60}
              tokenName={wizardTokenName}
              tokenAvatarSrc={tokenAvatarUrl}
              tokenAddress={ADDRESS_ZERO}
            />
          ) : (
            <div className="flex rounded-full bg-gray-200 p-4 text-gray-600">
              <Image size={28} />
            </div>
          )
        }
        fileOptions={{
          fileFormat: ['.PNG', '.JPG', '.SVG'],
          fileDimension: '120x120px',
          fileSize: '1MB',
        }}
        updateFn={updateFn}
        SuccessComponent={IconSuccessContent}
      />
    </>
  );
};

StepCreateTokenInputs.displayName = displayName;
export default StepCreateTokenInputs;
