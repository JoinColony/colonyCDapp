import { type UseToggleReturnType } from '~hooks/useToggle/types.ts';

import { type BaseFieldProps } from '../types.ts';

import type React from 'react';

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
    isSelectVisible?: boolean,
  ) => React.ReactNode;
  cardClassName?: string;
  togglerClassName?: string;
  footer?: React.ReactNode | ((toggle: UseToggleReturnType) => React.ReactNode);
  itemClassName?: string;
  renderOptionWrapper?: (
    props: {
      className?: string;
      onClick?: () => void;
      'aria-label'?: string;
      value?: TValue;
    },
    children: React.ReactNode,
  ) => React.ReactElement | null | undefined;
}

export interface FormCardSelectProps<TValue>
  extends Omit<CardSelectProps<TValue>, 'value' | 'state' | 'message'> {
  name: string;
  valueOverride?: string | number;
}
