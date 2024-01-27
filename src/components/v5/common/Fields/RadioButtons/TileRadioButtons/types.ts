import React from 'react';

import { RadioProps } from '../RadioButtonsBase/RadioBase/types.ts';
import { RadioButtonsBaseProps, RadioItem } from '../RadioButtonsBase/types.ts';

export interface TileRadioButtonItem<TValue>
  extends Omit<RadioItem<TValue>, 'children' | 'label'> {
  icon: Exclude<RadioProps['children'], undefined>;
  label: React.ReactNode;
}

export interface TileRadioButtonsProps<TValue>
  extends Omit<RadioButtonsBaseProps<TValue>, 'items'> {
  items: TileRadioButtonItem<TValue>[];
}

export interface FormTileRadioButtonsProps<TValue>
  extends Omit<TileRadioButtonsProps<TValue>, 'onChange' | 'value'> {
  name: string;
}
