import { type StepperButtonProps } from './partials/StepperButton/types.ts';

export interface StepperItem<TKey> {
  key: TKey | string;
  heading: Omit<StepperButtonProps, 'onClick' | 'stage'> & {
    decor?: JSX.Element | null;
  };
  content?: React.ReactNode;
  isOptional?: boolean;
  isSkipped?: boolean;
  isHidden?: boolean;
}

export interface StepperProps<TKey> {
  items: StepperItem<TKey>[];
  activeStepKey: TKey | string;
  setActiveStepKey?: (key: TKey | string) => void;
  setCurrentStepKey?: (key: TKey | string) => void;
}
