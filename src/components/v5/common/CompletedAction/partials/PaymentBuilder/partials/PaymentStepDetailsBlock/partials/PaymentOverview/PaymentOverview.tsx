import clsx from 'clsx';
import React, { type FC } from 'react';

import PaymentItem from '../PaymentItem/index.ts';

import { type PaymentOverviewProps } from './types.ts';

const PaymentOverview: FC<PaymentOverviewProps> = ({
  paid,
  payable,
  total,
  className,
}) => (
  <div className={clsx(className, 'w-full')}>
    <h4 className="mb-1 text-gray-900 text-1">Payment overview</h4>
    <table className="w-full text-sm">
      <tbody>
        <tr>
          <th className="py-1 align-top font-normal text-gray-600">
            Total payments
          </th>
          <td className="text-right">
            <PaymentItem payouts={total} />
          </td>
        </tr>
        <tr>
          <th className="py-1 align-top font-normal text-gray-600">Paid</th>
          <td className="text-right">
            <PaymentItem payouts={paid} />
          </td>
        </tr>
        <tr>
          <th className="py-1 align-top font-normal text-gray-600">
            Payable now
          </th>
          <td className="text-right">
            <PaymentItem payouts={payable} />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default PaymentOverview;
