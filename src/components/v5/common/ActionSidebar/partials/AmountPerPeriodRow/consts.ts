import { formatText } from '~utils/intl.ts';
import { type CardSelectOptionsGroup } from '~v5/common/Fields/CardSelect/types.ts';

import { AmountPerInterval } from './types.ts';

export const OPTIONS: CardSelectOptionsGroup<AmountPerInterval>[] = [
  {
    key: '1',
    title: formatText({ id: 'actionSidebar.amountPer.options.title' }),
    options: [
      {
        value: AmountPerInterval.Hour,
        label: formatText({
          id: 'actionSidebar.amountPer.options.hour',
        }),
      },
      {
        value: AmountPerInterval.Day,
        label: formatText({
          id: 'actionSidebar.amountPer.options.day',
        }),
      },
      {
        value: AmountPerInterval.Week,
        label: formatText({
          id: 'actionSidebar.amountPer.options.week',
        }),
      },
      {
        value: AmountPerInterval.Custom,
        label: formatText({
          id: 'actionSidebar.amountPer.options.custom',
        }),
      },
    ],
  },
];
