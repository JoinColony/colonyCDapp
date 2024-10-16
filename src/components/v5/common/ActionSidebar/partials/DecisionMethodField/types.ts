import { type DecisionMethod } from '~gql';

export interface DecisionMethodOption {
  label: string;
  value: DecisionMethod;
}

export interface DecisionMethodFieldProps {
  reputationOnly?: boolean;
  disabled?: boolean;
  tooltipContent?: string;
  filterOptionsFn?: (option: DecisionMethodOption) => boolean;
}
