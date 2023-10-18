import React, { FC } from 'react';

import Modal from '../../Modal';
import Numeral from '~shared/Numeral';
import { SpinnerLoader } from '~shared/Preloaders';
import Button from '~v5/shared/Button';
import FormFormattedInput from '~v5/common/Fields/InputBase/FormFormattedInput';
import { formatText } from '~utils/intl';
import { ActionForm } from '~shared/Fields';
import { TokensModalProps } from './types';
import { useTokensModal } from './hooks';

const displayName = 'v5.Modal.partials.TokensModal';

const TokensModal: FC<TokensModalProps> = ({ type, onClose, ...props }) => {
  const {
    validationSchema,
    actionType,
    tokenBalanceData,
    tokenDecimals,
    transform,
    tokenSymbol,
    pollActiveTokenBalance,
    tokenBalanceInEthers,
    loading,
  } = useTokensModal(type);

  return (
    <Modal {...props} onClose={onClose}>
      <ActionForm
        actionType={actionType}
        defaultValues={{ amount: '0' }}
        validationSchema={validationSchema}
        transform={transform}
        onSuccess={(_, { reset }) => {
          pollActiveTokenBalance();
          reset();
          onClose();
        }}
      >
        {({ setValue }) => (
          <>
            <h4 className="heading-5 mb-1.5">
              {formatText({ id: `tokensModal.${type}.title` })}
            </h4>
            <p className="text-md text-gray-600 mb-6">
              {formatText({ id: `tokensModal.${type}.description` })}
            </p>
            <div className="mb-8">
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="text-1">
                  {formatText({ id: `tokensModal.${type}.input` })}
                </p>
                <span className="text-sm text-gray-600 flex items-center gap-1">
                  {formatText({ id: 'tokensModal.balance' })}
                  {loading ? (
                    <SpinnerLoader appearance={{ size: 'small' }} />
                  ) : (
                    <Numeral
                      value={tokenBalanceData || 0}
                      decimals={tokenDecimals}
                      suffix={tokenSymbol}
                    />
                  )}
                </span>
              </div>
              <FormFormattedInput
                name="amount"
                options={{
                  numeral: true,
                  numeralDecimalScale: tokenDecimals,
                  numeralPositiveOnly: true,
                  rawValueTrimPrefix: true,
                  prefix: tokenSymbol,
                  tailPrefix: true,
                }}
                messageClassName="text-negative-400 text-sm mt-2"
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
                wrapperClassName="mb-6"
              />
            </div>
            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <Button
                mode="primaryOutline"
                onClick={onClose}
                text={formatText({ id: 'button.cancel' })}
                isFullSize
              />
              <Button
                mode="primarySolid"
                type="submit"
                text={formatText({ id: `tokensModal.${type}.submit` })}
                isFullSize
              />
            </div>
          </>
        )}
      </ActionForm>
    </Modal>
  );
};

TokensModal.displayName = displayName;

export default TokensModal;
