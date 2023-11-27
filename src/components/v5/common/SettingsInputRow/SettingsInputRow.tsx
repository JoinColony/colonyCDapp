import React, { FC, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';

import { SettingsInputRowProps } from './types';
import Button from '~v5/shared/Button';
import Input from '~v5/common/Fields/Input';
import Toast from '~shared/Extensions/Toast';
import { useSettingsInputRow } from './hooks';

const displayName = 'v5.common.SettingsInputRow';

const SettingsInputRow: FC<SettingsInputRowProps> = ({
  isOpen,
  handleSubmit,
}) => {
  const { formatMessage } = useIntl();
  const {
    customRpcValue,
    error,
    isDirty,
    isInputVisible,
    isValid,
    register,
    resetField,
    rpcValue,
    setIsInputVisible,
  } = useSettingsInputRow();

  useEffect(() => {
    if (!isOpen) {
      resetField('customRpc');
    }

    if (isOpen && customRpcValue.length === 0) {
      setIsInputVisible(true);
    }
  }, [resetField, isOpen, customRpcValue.length, setIsInputVisible]);

  const handleClick = () => {
    handleSubmit({ customRpc: rpcValue });
    setIsInputVisible(false);
    toast.success(
      <Toast
        type="success"
        title={{ id: 'advancedSettings.fees.toast.title' }}
        description={{
          id: 'advancedSettings.rpc.toast.description',
        }}
      />,
    );
  };

  return (
    <>
      {isOpen && (
        <div className="flex justify-between pb-6">
          <h5 className="text-1 mt-3">
            {formatMessage({ id: 'advancedSettings.rpc.subtitle' })}
          </h5>
          {(customRpcValue || rpcValue) && !isInputVisible && (
            <div className="flex items-center">
              <span className="text-md mr-6">{customRpcValue || rpcValue}</span>
              <Button
                mode="primarySolid"
                onClick={() => setIsInputVisible(true)}
              >
                {formatMessage({
                  id: 'button.updateEndpoint',
                })}
              </Button>
            </div>
          )}
          {isInputVisible && (
            <div className="w-full max-w-[36.25rem]">
              <Input
                name="customRpc"
                register={register}
                isError={!!error}
                customErrorMessage={error}
                isDecoratedError={error === 'advancedSettings.rpc.errorUnable'}
                className="text-md border-gray-300"
                successfulMessage={
                  isValid && rpcValue
                    ? 'advancedSettings.rpc.successful'
                    : undefined
                }
              />
              <Button
                mode="primarySolid"
                className="mt-6 ml-auto"
                disabled={!isValid || !rpcValue || !!error || !isDirty}
                onClick={handleClick}
              >
                {formatMessage({
                  id: 'button.saveEndpoint',
                })}
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

SettingsInputRow.displayName = displayName;

export default SettingsInputRow;
