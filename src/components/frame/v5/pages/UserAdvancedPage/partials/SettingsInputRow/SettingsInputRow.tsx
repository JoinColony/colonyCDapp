import React, { FC, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useFormContext } from 'react-hook-form';
import { toast } from 'react-toastify';

import { SettingsInputRowProps } from './types';
import { SlotKey } from '~hooks';
import Button from '~v5/shared/Button';
import Input from '~v5/common/Fields/Input';
import Toast from '~shared/Extensions/Toast';

const displayName = 'v5.pages.UserAdvancedPage.partials.SettingsInputRow';

const SettingsInputRow: FC<SettingsInputRowProps> = ({
  isOpen,
  handleSubmit,
}) => {
  const { formatMessage } = useIntl();
  const {
    register,
    watch,
    formState: { errors, defaultValues, isValid, isDirty },
    resetField,
  } = useFormContext();
  const error = errors[SlotKey.CustomRPC]?.message as string | undefined;
  const { [SlotKey.CustomRPC]: customRpcValue } = defaultValues;
  const rpcValue = watch(SlotKey.CustomRPC);
  const [isInputVisible, setIsInputVisible] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      resetField(SlotKey.CustomRPC);
    }

    if (isOpen && customRpcValue.length === 0) {
      setIsInputVisible(true);
    }
  }, [resetField, isOpen, customRpcValue.length]);

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
                {formatMessage({ id: 'advancedSettings.rpc.buttonUpdate' })}
              </Button>
            </div>
          )}
          {isInputVisible && (
            <div className="w-full max-w-[36.25rem]">
              <Input
                name={SlotKey.CustomRPC}
                register={register}
                isError={!!error}
                customErrorMessage={error}
                decoratedError={error === 'advancedSettings.rpc.errorUnable'}
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
                onClick={() => {
                  handleSubmit({ [SlotKey.CustomRPC]: rpcValue });
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
                }}
              >
                {formatMessage({ id: 'advancedSettings.rpc.buttonSave' })}
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
