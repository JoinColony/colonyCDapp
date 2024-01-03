import { Extension } from '@colony/colony-js';
import { BigNumber } from 'ethers';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { ExpenditureStatus } from '~gql';
import { useExtensionData } from '~hooks';
import { ActionTypes } from '~redux';
import { ActionButton } from '~shared/Button';
import MaskedAddress from '~shared/MaskedAddress';
import Numeral from '~shared/Numeral';
import { Colony, Expenditure } from '~types';
import { pipe, withMeta } from '~utils/actions';
import { notNull } from '~utils/arrays';
import { isInstalledExtensionData } from '~utils/extensions';

import styles from './ExpenditureStages.module.css';

interface ExpenditureStagesProps {
  expenditure: Expenditure;
  colony: Colony;
}

const ExpenditureStages = ({ expenditure, colony }: ExpenditureStagesProps) => {
  const navigate = useNavigate();

  const stages = expenditure.metadata?.stages?.filter(notNull) ?? [];

  const { extensionData } = useExtensionData(Extension.StagedExpenditure);

  const stagedExpenditureAddress =
    extensionData && isInstalledExtensionData(extensionData)
      ? extensionData.address
      : undefined;

  const transformPayload = pipe(withMeta({ navigate }));

  return (
    <div>
      <div>Stages</div>

      <ul className={styles.stages}>
        {expenditure.slots.map((slot) => {
          const slotStage = stages.find((stage) => stage.slotId === slot.id);
          const nonZeroPayouts = slot.payouts?.filter((payout) =>
            BigNumber.from(payout.amount).gt(0),
          );

          return (
            <li key={slot.id} className={styles.stage}>
              {slotStage ? (
                <div>
                  <div>Milestone</div>
                  <div>{slotStage.name}</div>
                </div>
              ) : (
                <div>No stage details found for this payout.</div>
              )}

              <div>
                <div>Token address</div>
                <div>
                  {nonZeroPayouts?.map((payout) => (
                    <MaskedAddress
                      key={payout.tokenAddress}
                      address={payout.tokenAddress}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div>Amount</div>
                <div>
                  {nonZeroPayouts?.map((payout) => (
                    <Numeral
                      key={payout.tokenAddress}
                      value={payout.amount}
                      decimals={colony.nativeToken.decimals}
                      suffix={colony.nativeToken.symbol}
                    />
                  ))}
                </div>
              </div>

              {expenditure.status === ExpenditureStatus.Finalized &&
                !slotStage?.isReleased && (
                  <ActionButton
                    actionType={ActionTypes.RELEASE_EXPENDITURE_STAGE}
                    transform={transformPayload}
                    values={{
                      colonyAddress: colony.colonyAddress,
                      expenditure,
                      slotId: slot.id,
                      tokenAddresses:
                        nonZeroPayouts?.map((payout) => payout.tokenAddress) ??
                        [],
                      stagedExpenditureAddress,
                    }}
                  >
                    Release
                  </ActionButton>
                )}

              {slotStage?.isReleased && <div>Released</div>}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ExpenditureStages;
