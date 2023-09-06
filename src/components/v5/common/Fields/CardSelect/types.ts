import React from 'react';
import { BaseFieldProps } from '../types';

interface CardSelectOption<TValue> {
  value: TValue;
  label: React.ReactNode;
  ariaLabel?: string;
}

export interface CardSelectProps<TValue> extends BaseFieldProps {
  title?: string;
  value?: TValue;
  options: CardSelectOption<TValue>[];
  onChange?: (value: TValue) => void;
  valueComparator?: (a: TValue, b: TValue) => boolean;
  keyExtractor?: (value: TValue) => React.Key;
  placeholder?: React.ReactNode;
}

export interface FormCardSelectProps<TValue>
  extends Omit<
    CardSelectProps<TValue>,
    'onChange' | 'value' | 'state' | 'message'
  > {
  name: string;
}
