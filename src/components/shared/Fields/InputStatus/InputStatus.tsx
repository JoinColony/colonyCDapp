import { useIntl } from 'react-intl';
import React from 'react';

import { getMainClasses } from '~utils/css';
import { formatText } from '~utils/intl';
import { InputProps } from '~shared/Fields/Input';
import { UniversalMessageValues, Message } from '~types';

import styles from './InputStatus.css';

interface InputStatusProps
  extends Pick<
    InputProps,
    'appearance' | 'status' | 'statusValues' | 'isLoading' | 'loadingAnnotation'
  > {
  /** Error text (if applicable) */
  error?: Message;

  /** Error message vaulues (if applicable) */
  errorValues?: UniversalMessageValues;

  /** Has input field been touched? */
  touched?: boolean;
}

const displayName = 'InputStatus';

const InputStatus = ({
  appearance = {},
  error,
  errorValues,
  isLoading,
  loadingAnnotation = '',
  status,
  statusValues,
  touched,
}: InputStatusProps) => {
  const { formatMessage } = useIntl();
  const errorText = error ? formatText(error, errorValues) : undefined;
  const statusText = status ? formatText(status, statusValues) : undefined;
  const loadingText = formatMessage(
    { id: 'status.loading' },
    { optionalText: formatText(loadingAnnotation) },
  );
  const text = errorText || statusText || '';
  const Element = appearance.direction === 'horizontal' ? 'span' : 'p';

  return (
    <Element
      className={getMainClasses(appearance, styles, {
        error: !!error && !isLoading,
        hidden: (!text && !isLoading) || (!!error && !touched),
      })}
    >
      {isLoading ? loadingText : text}
    </Element>
  );
};

InputStatus.displayName = displayName;

export default InputStatus;
