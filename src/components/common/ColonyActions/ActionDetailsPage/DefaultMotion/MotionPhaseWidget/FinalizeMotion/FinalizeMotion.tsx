import React from 'react';
import { defineMessages } from 'react-intl';

import { useAppContext, useColonyContext } from '~hooks';
import { ActionTypes } from '~redux';
import { ActionButton } from '~shared/Button';
import DetailItem from '~shared/DetailsWidget/DetailItem';
import { MotionData } from '~types';
import { mapPayload } from '~utils/actions';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.FinalizeMotion';

export const MSG = defineMessages({
  finalizeLabel: {
    id: `${displayName}.finalizeLabel`,
    defaultMessage: `Finalize motion`,
  },
  finalizeError: {
    id: `${displayName}.finalizeError`,
    defaultMessage: `There are insufficient funds in the domain to finalize this transaction. Please add more tokens and try again.`,
  },
  finalizeTooltip: {
    id: `${displayName}.finalizeTooltip`,
    defaultMessage: `Finalize completes a motion, allows stakes to be
    reclaimed, and if applicable, takes the action the motion was
    created to authorise.`,
  },
});

interface FinalizeMotionProps {
  motionData: MotionData;
  updateMotion: () => void;
}
const FinalizeMotion = ({
  motionData: { motionId },
  updateMotion,
}: FinalizeMotionProps) => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();

  const transform = mapPayload(() => ({
    colonyAddress: colony?.colonyAddress,
    userAddress: user?.walletAddress,
    motionId,
  }));

  // TODO
  // const domainBalance = BigNumber.from(domainBalanceData?.domainBalance ?? '0');

  const isFinalizable = true;
  // ColonyActionType.MintTokensMotion
  //  || domainBalance.gte(BigNumber.from(amount ?? '0'));

  return (
    <>
      <DetailItem
        label={MSG.finalizeLabel}
        tooltipText={MSG.finalizeTooltip}
        item={
          <ActionButton
            appearance={{ theme: 'primary', size: 'medium' }}
            text={{ id: 'button.finalize' }}
            disabled={!user || !isFinalizable}
            actionType={ActionTypes.MOTION_FINALIZE}
            transform={transform}
            dataTest="finalizeButton"
            onSuccess={updateMotion}
          />
        }
      />

      {/* {!isFinalizable && (
        <div className={styles.finalizeError}>
          <FormattedMessage {...MSG.finalizeError} />
        </div>
      )} */}
    </>
  );
};

FinalizeMotion.displayName = displayName;

export default FinalizeMotion;
