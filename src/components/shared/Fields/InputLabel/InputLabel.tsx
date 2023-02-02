import React, { ReactNode } from 'react';

import { Message, UniversalMessageValues } from '~types';
import { getMainClasses } from '~utils/css';
import { formatText } from '~utils/intl';

import { InputComponentAppearance as Appearance } from '../Input';
import styles from './InputLabel.css';

const displayName = 'InputLabel';

interface Props {
  /** Appearance object */
  appearance?: Appearance;

  /** Extra node to render on the top right in the label */
  extra?: ReactNode;

  /** Help text (will appear next to label text) */
  help?: Message;

  /** Values for help text (react-intl interpolation) */
  helpValues?: UniversalMessageValues;

  /** `id` attribute value of accompanied input field */
  inputId?: string;

  /** Label text */
  label: Message;

  /** Values for label text (react-intl interpolation) */
  labelValues?: UniversalMessageValues;

  /** Should only be visible for screenreaders, but not for display users */
  screenReaderOnly?: boolean;
}

const InputLabel = ({
  appearance,
  help,
  helpValues,
  extra,
  inputId = '',
  label: inputLabel,
  labelValues,
  screenReaderOnly = false,
}: Props) => {
  const helpText = formatText(help, helpValues);
  const labelText = formatText(inputLabel, labelValues);

  return (
    <label
      className={getMainClasses(appearance, styles, {
        screenReaderOnly,
      })}
      id={inputId ? `${inputId}-label` : undefined}
      htmlFor={inputId || undefined}
    >
      <div>
        <span className={styles.labelText}>{labelText}</span>
        {helpText && <span className={styles.help}>{helpText}</span>}
      </div>
      {extra && <span>{extra}</span>}
    </label>
  );
};

InputLabel.displayName = displayName;

export default InputLabel;
