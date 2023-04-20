import React from 'react';
import { useFormContext } from 'react-hook-form';
import { MessageDescriptor } from 'react-intl';

import { HookFormInput as Input } from '~shared/Fields';
import { noSpaces } from '~utils/cleave';

import styles from './CustomEndpointInput.css';

const displayName = 'common.UserProfileEdit.CustomEndpointInput';

interface CustomEndpointInputProps {
  inputName: string;
  label: MessageDescriptor;
  toggleName: string;
}

const CustomEndpointInput = ({ inputName, label, toggleName }: CustomEndpointInputProps) => {
  const { watch } = useFormContext();

  const toggleOn: boolean = watch(toggleName);
  const inputValue: string = watch(inputName);

  return (
    <div className={styles.main}>
      <Input
        label={label}
        appearance={{ colorSchema: 'grey' }}
        name={inputName}
        disabled={!toggleOn}
        formattingOptions={noSpaces}
        value={inputValue}
      />
    </div>
  );
};

CustomEndpointInput.displayName = displayName;

export default CustomEndpointInput;
