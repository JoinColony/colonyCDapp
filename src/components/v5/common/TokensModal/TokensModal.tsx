import { SpinnerGap } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { useIntl } from 'react-intl';

import { ActionForm } from '~shared/Fields/index.ts';
import Numeral from '~shared/Numeral/index.ts';
import { SpinnerLoader } from '~shared/Preloaders/index.ts';
import { formatText } from '~utils/intl.ts';
import FormFormattedInput from '~v5/common/Fields/InputBase/FormFormattedInput.tsx';
import IconButton from '~v5/shared/Button/IconButton.tsx';
import Button from '~v5/shared/Button/index.ts';
import Modal from '~v5/shared/Modal/Modal.tsx';
import { TokenAvatar } from '~v5/shared/TokenAvatar/TokenAvatar.tsx';

import { useTokensModal } from './hooks.ts';
import { type TokensModalProps } from './types.ts';

const displayName = 'v5.Modal.partials.TokensModal';

const TokensModal: FC<TokensModalProps> = ({ type, onClose, ...props }) => {
  const {
    validationSchema,
    actionType,
    tokenBalanceData,
    tokenDecimals,
    nativeToken,
    transform,
    tokenSymbol,
    pollActiveTokenBalance,
    tokenBalanceInEthers,
    loading,
  } = useTokensModal(type);
  const { formatMessage } = useIntl();

  return (
    <Modal {...props} onClose={onClose} shouldShowHeader>
      <ActionForm
        actionType={actionType}
        className="flex flex-grow flex-col"
        // defaultValues={{ amount: '0' }} // Disable default value
        validationSchema={validationSchema}
        transform={transform}
        onSuccess={(_, { reset }) => {
          pollActiveTokenBalance();
          reset();
          onClose();
        }}
      >
        {({ setValue, formState: { isSubmitting, isLoading } }) => (
          <div className="flex flex-grow flex-col justify-between">
            <div>
              <h4 className="mb-1.5 heading-5">
                {formatText({ id: `tokensModal.${type}.title` })}
              </h4>
              <p className="mb-6 text-md text-gray-600">
                {formatText({ id: `tokensModal.${type}.description` })}
              </p>
              <div className="mb-1 flex items-center justify-between gap-2">
                <p className="text-1">
                  {formatText({ id: `tokensModal.${type}.input` })}
                </p>
                <span className="flex items-center gap-1 text-sm text-gray-600">
                  {formatText(
                    { id: 'tokensModal.balance' },
                    {
                      value: loading ? (
                        <SpinnerLoader appearance={{ size: 'small' }} />
                      ) : (
                        <Numeral
                          value={tokenBalanceData || 0}
                          decimals={tokenDecimals}
                          suffix={` ${tokenSymbol}`}
                        />
                      ),
                    },
                  )}
                </span>
              </div>
              <FormFormattedInput
                name="amount"
                placeholder={formatMessage({ id: 'tokensModal.placeholder' })}
                customPrefix={
                  nativeToken ? (
                    <TokenAvatar
                      size={18}
                      tokenName={nativeToken.name}
                      tokenAddress={nativeToken.tokenAddress}
                      tokenAvatarSrc={nativeToken.avatar ?? undefined}
                    />
                  ) : undefined
                }
                options={{
                  numeralDecimalScale: tokenDecimals,
                  numeralPositiveOnly: true,
                  tailPrefix: true,
                }}
                buttonProps={{
                  label: formatText({ id: 'button.max' }) || '',
                  onClick: () => {
                    setValue('amount', tokenBalanceInEthers, {
                      shouldTouch: true,
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  },
                }}
                wrapperClassName="mb-8"
              />
            </div>
            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <Button
                mode="primaryOutline"
                onClick={onClose}
                text={formatText({ id: 'button.cancel' })}
                isFullSize
              />
              {isSubmitting || isLoading ? (
                <IconButton
                  className="w-full"
                  rounded="s"
                  text={{ id: 'button.pending' }}
                  icon={
                    <span className="ml-1.5 flex shrink-0">
                      <SpinnerGap className="animate-spin" size={18} />
                    </span>
                  }
                  title={{ id: 'button.pending' }}
                  ariaLabel={{ id: 'button.pending' }}
                />
              ) : (
                <Button
                  mode="primarySolid"
                  type="submit"
                  text={formatText({ id: `tokensModal.${type}.submit` })}
                  isFullSize
                />
              )}
            </div>
          </div>
        )}
      </ActionForm>
    </Modal>
  );
};

TokensModal.displayName = displayName;

export default TokensModal;
