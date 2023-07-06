import { RadioItemProps } from './types';

export const radioItems: RadioItemProps[] = [
  {
    value: 'radio-button-1',
    label: 'High trust team',
  },
  {
    value: 'radio-button-2',
    label: 'Second field',
    tooltip: {
      tooltipContent: 'Some content here',
    },
  },
  {
    value: 'radio-button-3',
    label: 'Third field',
    badge: {
      mode: 'coming-soon',
      text: 'Coming Soon',
    },
  },
  {
    value: 'radio-button-4',
    label: 'Fully open organization',
    description: 'We won’t know everyone, so we prefer higher security.',
    tooltip: {
      tooltipContent: 'Some content here',
    },
  },
  {
    value: 'radio-button-5',
    label: 'Testing governance',
    description: 'Do everything fast to figure out how things work.',
    tooltip: {
      tooltipContent: 'Some content here',
    },
    badge: {
      mode: 'coming-soon',
      text: 'Coming Soon',
    },
  },
  {
    value: 'radio-button-6',
    label: 'Custom (Advanced)',
    description: 'I know what I’m doing and want to configure it myself.',
    disabled: true,
  },
];
