import clsx from 'clsx';
import React, { type FC } from 'react';

import { formatText } from '~utils/intl.ts';

import PaymentItem from '../PaymentItem/PaymentItem.tsx';

import { type PaymentOverviewProps } from './types.ts';

const PaymentOverview: FC<PaymentOverviewProps> = ({
  paid,
  payable,
  total,
  className,
}) => (
  <div className={clsx(className, 'w-full')}>
    <h4 className="mb-1 text-gray-900 text-1">
      {formatText({ id: 'expenditure.paymentOverview' })}
    </h4>
    <table className="w-full text-sm">
      <tbody>
        <tr>
          <th className="py-1 text-left align-top font-normal text-gray-600">
            {formatText({ id: 'expenditure.paymentOverview.totalPayments' })}
          </th>
          <td className="text-right">
            <PaymentItem payouts={total} />
          </td>
        </tr>
        <tr>
          <th className="py-1 text-left align-top font-normal text-gray-600">
            {formatText({ id: 'expenditure.paymentOverview.paid' })}
          </th>
          <td className="text-right">
            <PaymentItem payouts={paid} />
          </td>
        </tr>
        {payable && (
          <tr>
            <th className="py-1 text-left align-top font-normal text-gray-600">
              {formatText({ id: 'expenditure.paymentOverview.payableNow' })}
            </th>
            <td className="text-right">
              <PaymentItem payouts={payable} />
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default PaymentOverview;
