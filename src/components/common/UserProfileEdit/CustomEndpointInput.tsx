import React from 'react';
import { useFormContext } from 'react-hook-form';
import { MessageDescriptor } from 'react-intl';

import { Input } from '~shared/Fields';
import { noSpaces } from '~utils/cleave';

import styles from './CustomEndpointInput.css';

const displayName = 'common.UserProfileEdit.CustomEndpointInput';

interface CustomEndpointInputProps {
  inputName: string;
  label: MessageDescriptor;
  toggleName: string;
}

const CustomEndpointInput = ({
  inputName,
  label,
  toggleName,
}: CustomEndpointInputProps) => {
  const { watch } = useFormContext();

  const toggleOn: boolean = watch(toggleName);

  return (
    <div className={styles.main}>
      <Input
        label={label}
        appearance={{ colorSchema: 'grey' }}
        name={inputName}
        disabled={!toggleOn}
        formattingOptions={noSpaces}
      />
    </div>
  );
};

CustomEndpointInput.displayName = displayName;

export default CustomEndpointInput;
