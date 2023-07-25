import {
  SPEED_OVER_SECURITY,
  SECURITY_OVER_SPEED,
  TESTING_GOVERNANCE,
  CUSTOM,
} from '~redux/constants';
import { RadioItemProps } from './types';

export const radioItems: RadioItemProps[] = [
  {
    value: SPEED_OVER_SECURITY,
    label: 'High trust team',
  },
  {
    value: SECURITY_OVER_SPEED,
    label: 'Second field',
    tooltip: {
      tooltipContent: 'Some content here',
    },
  },
  {
    value: TESTING_GOVERNANCE,
    label: 'Third field',
    badge: {
      mode: 'coming-soon',
      text: 'Coming Soon',
    },
  },
  {
    value: CUSTOM,
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
