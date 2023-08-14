import React, { useState } from 'react';

import ExpenditureForm from '~common/Expenditures/ExpenditureForm';
import MaskedAddress from '~shared/MaskedAddress';
import { Colony, Expenditure } from '~types';
import Numeral from '~shared/Numeral';
import Button from '~shared/Button';
import { ExpenditureStatus } from '~gql';

import styles from './ExpenditurePayouts.module.css';

interface ExpenditurePayoutsProps {
  expenditure: Expenditure;
  colony: Colony;
}

const ExpenditurePayouts = ({
  expenditure,
  colony,
}: ExpenditurePayoutsProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const canEditExpenditure =
    !isEditing && expenditure.status === ExpenditureStatus.Draft;

  return (
    <div>
      <div>
        Slots{' '}
        {canEditExpenditure && (
          <Button
            appearance={{
              theme: 'primary',
              size: 'small',
            }}
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
        )}
      </div>
      {isEditing ? (
        <ExpenditureForm
          expenditure={expenditure}
          submitButtonText="Save changes"
          showCancelButton
          onCancelClick={() => setIsEditing(false)}
        />
      ) : (
        <ul className={styles.payouts}>
          {expenditure.slots.map((slot) =>
            slot.payouts?.map((payout) => (
              <li
                key={`${slot.id}-${payout.tokenAddress}`}
                className={styles.payout}
              >
                <div>
                  <div>Slot ID</div>
                  <div>{slot.id}</div>
                </div>

                <div>
                  <div>Recipient address</div>
                  <MaskedAddress address={slot.recipientAddress ?? ''} />
                </div>

                <div>
                  <div>Token address</div>
                  <div>
                    <MaskedAddress
                      key={payout.tokenAddress}
                      address={payout.tokenAddress}
                    />
                  </div>
                </div>

                <div>
                  <div>Amount</div>
                  <div key={payout.tokenAddress}>
                    <Numeral
                      value={payout.amount}
                      decimals={colony.nativeToken.decimals}
                      suffix={colony.nativeToken.symbol}
                    />
                  </div>
                </div>

                <div>
                  <div>Claim delay</div>
                  <div>
                    {slot.claimDelay ? `${slot.claimDelay} seconds` : 'None'}
                  </div>
                </div>
              </li>
            )),
          )}
        </ul>
      )}
    </div>
  );
};

export default ExpenditurePayouts;
