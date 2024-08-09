import { type CardSelectOptionsGroup } from '~v5/common/Fields/CardSelect/types.ts';

export interface TimeRowFieldProps {
  name: string;
  options: CardSelectOptionsGroup<string>[];
  placeholder: string;
  selectedValueWrapperClassName?: string;
}
