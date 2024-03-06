import { formatText } from '~utils/intl.ts';

export const ATTRIBUTE_FILTERS = [
  {
    label: formatText({
      id: 'balancePage.filter.attributes.native',
    }),
    name: 'native',
  },
  // @TODO: Uncomment when token will have reputation attribute
  // {
  //   label: formatText({ id: 'balancePage.filter.attributes.reputation' }),
  //   name: 'reputation',
  // },
];
