import { useIntl } from 'react-intl';
import React from 'react';

import { getMainClasses } from '~utils/css';
import { formatText } from '~utils/intl';
import { HookFormInputProps } from '~shared/Fields/Input/HookForm';
import { UniversalMessageValues, Message } from '~types';

import styles from '../InputStatus.css';

interface HookFormInputStatusProps
  extends Pick<
    HookFormInputProps,
    'appearance' | 'status' | 'statusValues' | 'isLoading' | 'loadingAnnotation'
  > {
  /** Error text (if applicable) */
  error?: Message;

  /** Error message vaulues (if applicable) */
  errorValues?: UniversalMessageValues;

  /** Has input field been touched? */
  touched?: boolean;
}

const displayName = 'HookFormInputStatus';

const HookFormInputStatus = ({
  appearance = {},
  error,
  errorValues,
  isLoading,
  loadingAnnotation = '',
  status,
  statusValues,
  touched,
}: HookFormInputStatusProps) => {
  const { formatMessage } = useIntl();
  const errorText = formatText(error, errorValues);
  const statusText = formatText(status, statusValues);
  const loadingText = formatMessage(
    { id: 'status.loading' },
    { optionalText: formatText(loadingAnnotation) },
  );
  const text = errorText || statusText;
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

HookFormInputStatus.displayName = displayName;

export default HookFormInputStatus;
