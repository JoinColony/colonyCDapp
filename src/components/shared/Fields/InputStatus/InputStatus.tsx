import { MessageDescriptor, useIntl } from 'react-intl';
import React from 'react';
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';

import { SimpleMessageValues } from '~types';
import { getMainClasses } from '~utils/css';
import { isNil } from '~utils/lodash';

import { InputComponentAppearance as Appearance } from '../Input';

import styles from './InputStatus.css';

interface Props {
  /** Appearance object */
  appearance?: Appearance;

  /** Error text (if applicable) */
  error?:
    | string
    | MessageDescriptor
    | FieldError
    | Merge<FieldError, FieldErrorsImpl<any>>
    | undefined;

  /** Status text (if applicable) */
  status?: string | MessageDescriptor;

  /** Values for status text (react-intl interpolation) (if applicable) */
  statusValues?: SimpleMessageValues;
  touched?: boolean;
}

const displayName = 'InputStatus';

const InputStatus = ({
  appearance = {},
  error,
  status,
  statusValues,
  touched,
}: Props) => {
  const { formatMessage } = useIntl();
  const getErrorText = () => {
    if (typeof error === 'string' || !error) {
      return error;
    }
    if ('message' in error) {
      return error.message?.toString();
    }
    if ('id' in error) {
      return formatMessage(error);
    }
    return error;
  };
  const errorText = getErrorText();
  const statusText =
    typeof status === 'object' ? formatMessage(status, statusValues) : status;
  const text = errorText || statusText;
  const Element = appearance.direction === 'horizontal' ? 'span' : 'p';
  return (
    <Element
      className={getMainClasses(appearance, styles, {
        error: !!error,
        hidden: !text || (!!error && !isNil(touched) && !touched),
      })}
    >
      {text as string}
    </Element>
  );
};

InputStatus.displayName = displayName;

export default InputStatus;
