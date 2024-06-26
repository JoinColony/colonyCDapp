import React, { type FC, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';

import Toast from '~shared/Extensions/Toast/index.ts';
import Input from '~v5/common/Fields/Input/index.ts';
import Button from '~v5/shared/Button/index.ts';

import { useSettingsInputRow } from './hooks.ts';
import { type SettingsInputRowProps } from './types.ts';

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
        title={{ id: 'advancedSettings.toast.changesSaved' }}
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
          <h5 className="mt-3 text-1">
            {formatMessage({ id: 'advancedSettings.rpc.subtitle' })}
          </h5>
          {(customRpcValue || rpcValue) && !isInputVisible && (
            <div className="flex items-center">
              <span className="mr-6 text-md">{customRpcValue || rpcValue}</span>
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
                className="border-gray-300 text-md"
                successfulMessage={
                  isValid && rpcValue
                    ? 'advancedSettings.rpc.successful'
                    : undefined
                }
              />
              <Button
                mode="primarySolid"
                className="ml-auto mt-6"
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
