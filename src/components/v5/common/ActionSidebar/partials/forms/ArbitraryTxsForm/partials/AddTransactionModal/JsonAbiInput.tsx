import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { formatText } from '~utils/intl.ts';
import FormTextareaBase from '~v5/common/Fields/TextareaBase/FormTextareaBase.tsx';
import Button from '~v5/shared/Button/Button.tsx';

import { validateJsonAbi } from './consts.tsx';
import { MSG } from './translation.ts';

interface JsonAbiInputProps {
  disabled?: boolean;
}

export const JsonAbiInput: React.FC<JsonAbiInputProps> = ({ disabled }) => {
  const { watch, setValue } = useFormContext();
  const jsonAbiField = watch('jsonAbi');
  const [isFormatted, setIsFormatted] = useState(false);

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
        disabled={disabled}
        onClick={toggleJsonFormat}
      >
        {formatText(MSG.jsonAbiFormatLink)}
      </Button>
      <FormTextareaBase
        name="jsonAbi"
        label={formatText(MSG.jsonAbiField)}
        id="jsonAbi"
        mode="primary"
        className="h-[10.25rem]"
        shouldUseAutoSize={false}
        rows={7}
        disabled={disabled}
        rules={{ validate: validateJsonAbi }}
      />
    </div>
  );
};
