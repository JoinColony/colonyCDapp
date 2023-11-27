import { ReactNode } from 'react';
import { MessageDescriptor } from 'react-intl';

import { SimpleMessageValues } from '~types';

export interface Appearance {
  alignOptions?: 'left' | 'center' | 'right';
  borderedOptions?: 'true' | 'false';
  size?: 'medium' | 'mediumLarge' | 'large';
  theme?: 'default' | 'alt' | 'grey' | 'grid';
  width?: 'content' | 'fluid' | 'strict';
}

export interface SelectProps<V = string | number> {
  /** Appearance object */
  appearance?: Appearance;

  /** Should `select` be disabled */
  disabled?: boolean;

  /** Should render the select without a label */
  elementOnly?: boolean;

  /** Help text */
  help?: string | MessageDescriptor;

  /** Help text values for intl interpolation */
  helpValues?: SimpleMessageValues;

  /** Html id attribute */
  id?: string;

  /** Label text */
  label: string | MessageDescriptor;

  /** Label text values for intl interpolation */
  labelValues?: SimpleMessageValues;

  /** Html name attribute */
  name: string;

  /** Callback function, called after value is changed */
  onChange?: (value: SelectOption<V>['value']) => void;

  /** Available `option`s for the select */
  options: SelectOption<V>[];

  /** Render at the bottom of the select list box */
  optionsFooter?: ReactNode;

  /** Status text */
  placeholder?: string | MessageDescriptor;

  /** Render the actively selected option */
  renderActiveOption?: (
    activeOption: SelectOption<V> | undefined,
    activeOptionLabel: string,
  ) => ReactNode;

  /** Status text */
  status?: string | MessageDescriptor;

  /** Status text values for intl interpolation */
  statusValues?: SimpleMessageValues;

  /** Provides value for data-test prop in select button used on cypress testing */
  dataTest?: string;

  /** Provides value for data-test prop in select items used on cypress testing */
  itemDataTest?: string;
}

export interface SelectOption<V = string | number> {
  // Will override `label` for display - `label` still required for a11y
  children?: ReactNode;
  disabled?: boolean;
  label: MessageDescriptor | string;
  value: V;
  labelValues?: SimpleMessageValues;
  labelElement?: ReactNode;
}
