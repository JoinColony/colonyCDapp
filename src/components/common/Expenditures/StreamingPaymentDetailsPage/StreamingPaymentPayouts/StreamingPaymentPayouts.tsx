import { weiToEth } from '@web3-onboard/common';
import React from 'react';

import MaskedAddress from '~shared/MaskedAddress';
import { StreamingPayment } from '~types';

import styles from '../StreamingPaymentDetailsPage.module.css';

interface StreamingPaymentPayoutsProps {
  streamingPayment: StreamingPayment;
}

const StreamingPaymentPayouts = ({
  streamingPayment,
}: StreamingPaymentPayoutsProps) => {
  return (
    <div className={styles.payoutsContainer}>
      <div>Payouts</div>
      <ul>
        {streamingPayment.payouts?.map((payout) => (
          <li key={payout.tokenAddress} className={styles.payout}>
            <div>
              <div>Token address</div>
              <div>
                <MaskedAddress address={payout.tokenAddress} />
              </div>
            </div>
            <div>
              <div>Amount</div>
              <div>{weiToEth(payout.amount)}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StreamingPaymentPayouts;
