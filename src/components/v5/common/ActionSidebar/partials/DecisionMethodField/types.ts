import { type DecisionMethod } from '~types/actions.ts';

export interface DecisionMethodOption {
  label: string;
  value: DecisionMethod;
}

export interface DecisionMethodFieldProps {
  reputationOnly?: boolean;
  disabled?: boolean;
  filterOptionsFn?: (option: DecisionMethodOption) => boolean;
}
