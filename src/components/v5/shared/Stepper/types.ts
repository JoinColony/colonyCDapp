import { StepperButtonProps } from './partials/StepperButton/types';

export interface StepperItem {
  key: string;
  heading: Omit<StepperButtonProps, 'onClick' | 'stage'> & {
    decor?: JSX.Element;
  };
  content: JSX.Element;
  isOptional?: boolean;
  isSkipped?: boolean;
}

export interface StepperProps {
  items: StepperItem[];
  activeStepIndex: number;
  setActiveStepIndex: (index: number) => void;
}
