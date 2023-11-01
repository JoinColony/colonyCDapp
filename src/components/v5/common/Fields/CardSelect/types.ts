import React from 'react';
import { UseToggleReturnType } from '~hooks/useToggle/types';
import { BaseFieldProps } from '../types';

export interface CardSelectOption<TValue> {
  value: TValue;
  label: React.ReactNode;
  ariaLabel?: string;
}

export interface CardSelectOptionsGroup<TValue> {
  key: React.Key;
  title?: React.ReactNode;
  options: CardSelectOption<TValue>[];
}

export interface CardSelectProps<TValue> extends BaseFieldProps {
  disabled?: boolean;
  readonly?: boolean;
  title?: string;
  value?: TValue;
  options: CardSelectOptionsGroup<TValue>[] | CardSelectOption<TValue>[];
  onChange?: (value: TValue) => void;
  valueComparator?: (a: TValue, b: TValue) => boolean;
  keyExtractor?: (value: TValue) => React.Key;
  placeholder?: React.ReactNode;
  renderSelectedValue?: (
    option: CardSelectOption<TValue> | undefined,
    placeholder: React.ReactNode,
  ) => React.ReactNode;
  cardClassName?: string;
  footer?: React.ReactNode | ((toggle: UseToggleReturnType) => React.ReactNode);
}

export interface FormCardSelectProps<TValue>
  extends Omit<
    CardSelectProps<TValue>,
    'onChange' | 'value' | 'state' | 'message'
  > {
  name: string;
}
