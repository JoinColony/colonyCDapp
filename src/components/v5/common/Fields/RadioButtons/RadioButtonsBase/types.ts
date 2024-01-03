import { RadioProps } from './RadioBase/types';

export type OnRadioListChange<V> = (item: V | undefined) => void;

export interface RadioItem<TValue>
  extends Omit<RadioProps, 'value' | 'checked' | 'onChange' | 'name'> {
  value: TValue;
}

export interface RadioButtonsBaseProps<TValue> {
  items: RadioItem<TValue>[];
  value?: TValue;
  onChange?: OnRadioListChange<TValue>;
  name?: string;
  defaultValue?: string;
  disabled?: boolean;
  keyExtractor?: (value: TValue) => React.Key;
  valueComparator?: (
    value: TValue,
    selectedValue: TValue | undefined,
  ) => boolean;
  allowUnselect?: boolean;
  className?: string;
}
