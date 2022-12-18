import React from 'react';
import { useFormContext } from 'react-hook-form';
import { defineMessages, MessageDescriptor } from 'react-intl';

import Button from '~shared/Button';
import { HookFormInput as Input } from '~shared/Fields';
import { noSpaces } from '~utils/cleave';

import styles from './AdvancedSettingsRow.css';

const displayName = 'common.UserProfileEdit.CustomEndpointInput';

const MSG = defineMessages({
  validate: {
    id: `${displayName}.validate`,
    defaultMessage: 'Validate',
  },
});

interface CustomEndpointInputProps {
  handleValidation?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  inputName: string;
  label: MessageDescriptor;
  toggleName: string;
}

const CustomEndpointInput = ({
  handleValidation,
  inputName,
  label,
  toggleName,
}: CustomEndpointInputProps) => {
  const {
    watch,
    formState: { isValid },
  } = useFormContext();

  const toggleOn: boolean = watch(toggleName);
  const inputValue: string = watch(inputName);

  return (
    <>
      <Input
        label={label}
        appearance={{ colorSchema: 'grey' }}
        name={inputName}
        disabled={!toggleOn}
        formattingOptions={noSpaces}
        value={inputValue}
      />
      <div className={styles.validateButtonContainer}>
        <Button
          text={MSG.validate}
          disabled={!toggleOn || !isValid}
          onClick={handleValidation}
          // @TODO Make button conditional on handleValidation being defined (once rpc validation added)
        />
      </div>
    </>
  );
};

CustomEndpointInput.displayName = displayName;

export default CustomEndpointInput;
