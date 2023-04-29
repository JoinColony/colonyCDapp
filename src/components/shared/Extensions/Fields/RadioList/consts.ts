import { RadioItemProps } from './types';

export const radioItems: RadioItemProps[] = [
  {
    value: 'radio-button-1',
    label: 'High trust team',
  },
  {
    value: 'radio-button-2',
    label: 'Fully open organization',
    description: 'We won’t know everyone, so we prefer higher security.',
  },
  {
    value: 'radio-button-3',
    label: 'Testing governance',
    description: 'Do everything fast to figure out how things work.',
  },
  {
    value: 'radio-button-4',
    label: 'Custom (Advanced)',
    description: 'I know what I’m doing and want to configure it myself.',
    disabled: true,
  },
];
