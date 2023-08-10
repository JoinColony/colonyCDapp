import React, { useState } from 'react';

import ExpenditureForm from '~common/Expenditures/ExpenditureForm';
import MaskedAddress from '~shared/MaskedAddress';
import { Colony, Expenditure } from '~types';
import Numeral from '~shared/Numeral';
import Button from '~shared/Button/Button';

import styles from './ExpenditureSlots.module.css';
import { ExpenditureStatus } from '~gql';

interface ExpenditureSlotsProps {
  expenditure: Expenditure;
  colony: Colony;
}

const ExpenditureSlots = ({ expenditure, colony }: ExpenditureSlotsProps) => {
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
        <ul className={styles.slots}>
          {expenditure.slots.map((slot) => (
            <li key={slot.id} className={styles.slot}>
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
                {slot.payouts?.map((payout) => (
                  <div>
                    <MaskedAddress
                      key={payout.tokenAddress}
                      address={payout.tokenAddress}
                    />
                  </div>
                ))}
              </div>

              <div>
                <div>Amount</div>
                {slot.payouts?.map((payout) => (
                  <div key={payout.tokenAddress}>
                    <Numeral
                      value={payout.amount}
                      decimals={colony.nativeToken.decimals}
                      suffix={colony.nativeToken.symbol}
                    />
                  </div>
                ))}
              </div>

              <div>
                <div>Claim delay</div>
                <div>
                  {slot.claimDelay ? `${slot.claimDelay} seconds` : 'None'}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExpenditureSlots;
