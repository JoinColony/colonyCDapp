import { type DecisionMethod } from '~types/actions.ts';

export interface DecisionMethodOption {
  label: string;
  value: DecisionMethod;
}

export interface DecisionMethodFieldProps {
  motionOnly?: boolean;
  disabled?: boolean;
  tooltipContent?: string;
  filterOptionsFn?: (option: DecisionMethodOption) => boolean;
}
