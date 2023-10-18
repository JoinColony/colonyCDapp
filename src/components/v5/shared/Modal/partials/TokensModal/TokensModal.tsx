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
    nativeToken,
    pollActiveTokenBalance,
    tokenBalanceInEthers,
    loading,
  } = useTokensModal(type);

  return (
    <Modal {...props} onClose={onClose}>
      <ActionForm
        actionType={actionType}
        defaultValues={{ amount: 0 }}
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
                      suffix={nativeToken?.symbol}
                    />
                  )}
                </span>
              </div>
              {/* Update this component when Joanna will finish this in staking motion flow */}
              <FormFormattedInput
                name="amount"
                options={{
                  numeral: true,
                  numeralPositiveOnly: true,
                  numeralDecimalScale: tokenDecimals,
                  // prefix: nativeToken?.symbol,
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
