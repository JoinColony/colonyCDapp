import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { formatText } from '~utils/intl.ts';
import FormTextareaBase from '~v5/common/Fields/TextareaBase/FormTextareaBase.tsx';
import Button from '~v5/shared/Button/Button.tsx';

import { validateJsonAbi } from './consts.ts';
import { MSG } from './translation.ts';

export const JsonAbiInput: React.FC = () => {
  const { watch, setValue, clearErrors, trigger } = useFormContext();
  const jsonAbiField = watch('jsonAbi');
  const [isFormatted, setIsFormatted] = useState(false);
  const [hideEditWarning, setHideEditWarning] = useState(false);
  const contractAddressField = watch('contractAddress');

  useEffect(() => {
    // reset jsonAbi state if contractAddress updated
    // jsonAbi will be filled with data after successful ABI response
    setValue('jsonAbi', '');
    setIsFormatted(false);
  }, [contractAddressField, setValue]);

  useEffect(() => {
    trigger('jsonAbi'); // trigger errors in case value was updated by ContractAddress component
    if (!jsonAbiField) {
      setHideEditWarning(false);
      clearErrors();
    }
  }, [jsonAbiField, clearErrors, trigger]);

  const toggleJsonFormat = () => {
    try {
      const parsedJson = JSON.parse(jsonAbiField);
      let newValue: string;

      if (isFormatted) {
        newValue = JSON.stringify(parsedJson);
      } else {
        newValue = JSON.stringify(parsedJson, null, 2);
      }

      setValue('jsonAbi', newValue);
      setIsFormatted(!isFormatted);
    } catch (error) {
      console.error('Invalid JSON:', error);
    }
  };
  return (
    <div className="relative">
      <Button
        className="absolute right-0"
        mode="link"
        onClick={toggleJsonFormat}
      >
        {formatText(MSG.jsonAbiFormatLink)}
      </Button>
      <div>
        <FormTextareaBase
          name="jsonAbi"
          id="jsonAbi"
          mode="primary"
          className="h-[10.25rem]"
          shouldUseAutoSize={false}
          rows={7}
          label={formatText(MSG.jsonAbiField)}
          rules={{ validate: validateJsonAbi }}
          textareaOverlay={
            jsonAbiField &&
            !hideEditWarning && (
              <div className="absolute bottom-0 left-0 right-0 top-0 flex cursor-pointer items-center justify-center rounded bg-base-sprite opacity-0 transition-opacity hover:opacity-100">
                <Button
                  onClick={() => {
                    setHideEditWarning(true);
                  }}
                >
                  {formatText(MSG.jsonAbiEditInfo)}
                </Button>
              </div>
            )
          }
        />
      </div>
    </div>
  );
};
