import { StreamingPaymentEndCondition } from '~gql';
import { formatText } from '~utils/intl.ts';
import { type CardSelectOptionsGroup } from '~v5/common/Fields/CardSelect/types.ts';

import { CUSTOM_DATE_VALUE } from './partials/TimeRowField/consts.ts';

export const START_IMMEDIATELY_VALUE = 'start_immediately';

export const START_OPTIONS: CardSelectOptionsGroup<string>[] = [
  {
    key: '1',
    title: formatText({ id: 'actionSidebar.starts.options.title' }),
    options: [
      {
        value: START_IMMEDIATELY_VALUE,
        label: formatText({
          id: 'actionSidebar.starts.options.startImidiately',
        }),
      },
      {
        value: CUSTOM_DATE_VALUE,
        label: formatText({
          id: 'actionSidebar.starts.options.customDateAndTime',
        }),
      },
    ],
  },
];

export const END_OPTIONS: CardSelectOptionsGroup<string>[] = [
  {
    key: '1',
    title: formatText({ id: 'actionSidebar.ends.options.title' }),
    options: [
      {
        value: StreamingPaymentEndCondition.WhenCancelled,
        label: formatText({
          id: 'actionSidebar.ends.options.whenCancelled',
        }),
      },
      {
        value: StreamingPaymentEndCondition.LimitReached,
        label: formatText({
          id: 'actionSidebar.ends.options.limitReached',
        }),
      },
      {
        value: StreamingPaymentEndCondition.FixedTime,
        label: formatText({
          id: 'actionSidebar.ends.options.fixedTime',
        }),
      },
    ],
  },
];
