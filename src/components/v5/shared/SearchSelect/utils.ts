import {
  type IconOption,
  type TeamOption,
  type TokenOption,
  type UserOption,
  type SearchSelectOption,
} from './types.ts';

export const sortDisabled = <T>(options: SearchSelectOption<T>[]) => {
  const enabled = options.filter((option) => !option.isDisabled);
  const disabled = options.filter((option) => option.isDisabled);

  return [...enabled, ...disabled];
};

type OptionWithVisual = UserOption | TeamOption | TokenOption | IconOption;

export const hasOptionVisualElement = <T extends OptionWithVisual>(
  option: SearchSelectOption<T>,
): boolean => {
  if (
    ('showAvatar' in option && option.showAvatar) ||
    ('color' in option && option.color) ||
    ('token' in option && !!option.token) ||
    ('icon' in option && !option.icon)
  ) {
    return true;
  }

  return false;
};
