import { CardSelectOption, CardSelectProps } from './types';

export const isFlatOptions = <TValue>(
  options: CardSelectProps<TValue>['options'],
): options is CardSelectOption<TValue>[] =>
  !options.some((option) => 'options' in option);
