import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import SpinnerLoader from '~shared/Preloaders/SpinnerLoader.tsx';
import { formatText } from '~utils/intl.ts';
import FormTextareaBase from '~v5/common/Fields/TextareaBase/FormTextareaBase.tsx';
import Button from '~v5/shared/Button/Button.tsx';

import { validateJsonAbi } from './consts.ts';
import { MSG } from './translation.ts';

interface JsonAbiInputProps {
  loading?: boolean;
}
export const JsonAbiInput: React.FC<JsonAbiInputProps> = ({ loading }) => {
  const { watch, setValue, clearErrors, trigger } = useFormContext();
  const jsonAbiField = watch('jsonAbi');
  const [isFormatted, setIsFormatted] = useState(false);
  const [hideEditWarning, setHideEditWarning] = useState(false);

  useEffect(() => {
    const { unsubscribe } = watch((_, { name }) => {
      if (name === 'contractAddress') {
        // Reset jsonAbi state if contractAddress is updated
        // jsonAbi will be filled with data after a successful ABI response
        setValue('jsonAbi', '');
        setIsFormatted(false);
      }
    });

    return () => unsubscribe();
  }, [setValue, watch]);

  useEffect(() => {
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
  const getTextareaOverlay = () => {
    if (loading) {
      return (
        <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center rounded bg-base-sprite">
          <SpinnerLoader appearance={{ size: 'medium' }} />
        </div>
      );
    }
    if (jsonAbiField && !hideEditWarning) {
      return (
        <div className="absolute bottom-0 left-0 right-0 top-0 flex cursor-pointer items-center justify-center rounded bg-base-sprite opacity-0 transition-opacity hover:opacity-100">
          <Button
            onClick={() => {
              setHideEditWarning(true);
            }}
            className="min-w-[12.5rem]"
          >
            {formatText(MSG.jsonAbiEditInfo)}
          </Button>
        </div>
      );
    }
    return null;
  };
  return (
    <div className="relative">
      <Button
        className="absolute right-0 z-base text-sm"
        mode="link"
        type="button"
        onClick={toggleJsonFormat}
        disabled={!jsonAbiField}
      >
        {isFormatted
          ? formatText(MSG.jsonAbiUnformatLink)
          : formatText(MSG.jsonAbiFormatLink)}
      </Button>
      <div>
        <FormTextareaBase
          name="jsonAbi"
          id="jsonAbi"
          mode="primary"
          className="h-[10.25rem]"
          shouldUseAutoSize={false}
          placeholder={formatText(MSG.jsonAbiFieldPlaceholder)}
          disabled={loading}
          rows={7}
          label={formatText(MSG.jsonAbiField)}
          labelClassName="mr-[5rem]"
          rules={{ validate: validateJsonAbi }}
          textareaOverlay={getTextareaOverlay()}
        />
      </div>
    </div>
  );
};
