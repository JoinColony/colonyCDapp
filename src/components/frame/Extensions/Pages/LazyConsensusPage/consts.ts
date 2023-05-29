import { RadioItemProps } from '~shared/Extensions/Fields/RadioList/types';

export const mockedGovernance: RadioItemProps[] = [
  {
    value: 'radio-button-1',
    label: 'High trust team',
    description: 'We’re a closed community, we value speed over security.',
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
  },
];
