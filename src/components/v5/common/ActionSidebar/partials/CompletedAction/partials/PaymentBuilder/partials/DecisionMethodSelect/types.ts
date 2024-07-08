import {
  type SelectBaseOption,
  type SelectBaseProps,
  type SelectOption,
} from '~v5/common/Fields/Select/types.ts';

export interface DecisionMethodOption extends SelectOption {
  isDisabled?: boolean;
}

export interface DecisionMethodSelectProps
  extends SelectBaseProps<SelectBaseOption> {
  options: DecisionMethodOption[];
  name: string;
}
