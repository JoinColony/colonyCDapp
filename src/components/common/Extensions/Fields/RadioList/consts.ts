import { GovernanceOptions } from '~frame/Extensions/pages/Extensions/ExtensionsListingPage/types.ts';

import { type RadioItemProps } from './types.ts';

export const radioItems: RadioItemProps[] = [
  {
    value: GovernanceOptions.SPEED_OVER_SECURITY,
    label: 'High trust team',
  },
  {
    value: GovernanceOptions.SECURITY_OVER_SPEED,
    label: 'Second field',
    tooltip: {
      tooltipContent: 'Some content here',
    },
  },
  {
    value: GovernanceOptions.TESTING_GOVERNANCE,
    label: 'Third field',
    badge: {
      mode: 'coming-soon',
      text: 'Coming Soon',
    },
  },
  {
    value: GovernanceOptions.CUSTOM,
    label: 'Fully open organization',
    description: "We won't know everyone, so we prefer higher security.",
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
    description: "I know what I'm doing and want to configure it myself.",
    disabled: true,
  },
];
