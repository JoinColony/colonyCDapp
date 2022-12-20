import { ReactNode } from 'react';
import { SetValueConfig } from 'react-hook-form';

import { Message, SimpleMessageValues } from '~types';

export interface MaxButtonParams {
  maxAmount: string;
  options?: SetValueConfig;
  customOnClickFn?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface CoreInputProps {
  /** Input field name (form variable) */
  name: string;
  /** Label text */
  label?: Message;
  /** Label text values for intl interpolation */
  labelValues?: SimpleMessageValues;
  /** Set the input field to a disabled state */
  disabled?: boolean;
  /** Should display the input with the label hidden */
  elementOnly?: boolean;
  /** Testing */
  dataTest?: string;
  /** Extra node to render on the top right in the label */
  extra?: ReactNode;
  /** Help text */
  help?: Message;
  /** Help text values for intl interpolation */
  helpValues?: SimpleMessageValues;
  /** Placeholder text */
  placeholder?: Message;
  /** Placeholder text values for intl interpolation */
  placeholderValues?: SimpleMessageValues;
  /** Status text */
  status?: Message;
  /** Status text values for intl interpolation */
  statusValues?: SimpleMessageValues;
}
