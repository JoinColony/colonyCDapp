import React from 'react';

import { HookFormTextArea as Textarea, HookFormTextareaComponentProps as TextareaComponentProps } from '../Textarea';

import styles from './Annotations.css';

const Annotations = ({
  appearance = { colorSchema: 'grey', resizable: 'vertical' },
  maxLength = 4000,
  ...props
}: TextareaComponentProps) => {
  const textAreaProps: TextareaComponentProps = {
    appearance,
    maxLength,
    ...props,
  };

  return (
    <div className={styles.container}>
      <Textarea {...textAreaProps} />
    </div>
  );
};

Annotations.displayName = 'Annotations';

export default Annotations;
