import { defineMessages } from 'react-intl';

export const displayName = 'v5.frame.ColonyHome.TotalInOutBalance';

export const MSG = defineMessages({
  paymentsLegendTitle: {
    id: `${displayName}.paymentsLegendTitle`,
    defaultMessage: 'Payments',
  },
  incomeLegendTitle: {
    id: `${displayName}.incomeLegendTitle`,
    defaultMessage: 'Income',
  },
});

// @TODO this will be replaced with real data
export const dummyData = [
  {
    label: '01',
    in: '0',
    out: '0',
  },
  {
    label: '02',
    in: '0',
    out: '0',
  },
  {
    label: '03',
    in: '0',
    out: '0',
  },
  {
    label: '04',
    in: '0',
    out: '0',
  },
];
