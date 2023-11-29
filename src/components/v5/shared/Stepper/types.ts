import { StepperButtonProps } from './partials/StepperButton/types';

export interface StepperItem<TKey> {
  key: TKey;
  heading: Omit<StepperButtonProps, 'onClick' | 'stage'> & {
    decor?: JSX.Element | null;
  };
  content: React.ReactNode;
  isOptional?: boolean;
  isSkipped?: boolean;
  isHidden?: boolean;
}

export interface StepperProps<TKey> {
  items: StepperItem<TKey>[];
  activeStepKey: TKey;
  setActiveStepKey: (key: TKey) => void;
}
