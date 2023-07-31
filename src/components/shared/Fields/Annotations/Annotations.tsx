import React from 'react';

import { Textarea, TextareaComponentProps } from '../Textarea';
import { MAX_ANNOTATION_LENGTH } from '~constants';

import styles from './Annotations.css';

const Annotations = ({
  appearance = { colorSchema: 'grey', resizable: 'vertical' },
  maxLength = MAX_ANNOTATION_LENGTH,
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
