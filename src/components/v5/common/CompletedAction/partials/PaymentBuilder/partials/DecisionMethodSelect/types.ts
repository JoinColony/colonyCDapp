import {
  type SelectBaseOption,
  type SelectBaseProps,
  type SelectOption,
} from '~v5/common/Fields/Select/types.ts';

export interface DecisionMethodSelectProps
  extends SelectBaseProps<SelectBaseOption> {
  options: SelectOption[];
}
