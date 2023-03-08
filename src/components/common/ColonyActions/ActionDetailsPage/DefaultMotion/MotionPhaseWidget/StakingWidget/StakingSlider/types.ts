import { StakingValidationMessageProps } from './SliderMessages/StakingValidationMessage';
import { StakingWidgetSliderProps } from './StakingWidgetSlider';

export type SomeStakingValidationProps = Omit<
  StakingValidationMessageProps,
  'limitExceeded' | 'minUserStake' | 'maxUserStake'
>;

export type SomeStakingWidgetSliderProps = Omit<
  StakingWidgetSliderProps,
  'setLimitExceeded'
>;

export type SomeSliderAnnotationProps = {
  enoughTokens: boolean;
  totalPercentage: number;
};
