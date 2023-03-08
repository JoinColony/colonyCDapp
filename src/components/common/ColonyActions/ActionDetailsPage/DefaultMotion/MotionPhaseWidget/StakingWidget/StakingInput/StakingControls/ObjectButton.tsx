import React from 'react';

import Button from '~shared/Button';
import { useStakingWidgetContext } from '../../StakingWidgetProvider';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.StakingWidget.ObjectButton';

const ObjectButton = () => {
  const { canUserStakeNay, totalNAYStaked, setIsSummary } =
    useStakingWidgetContext();

  //const openRaiseObjectionDialog = useDialog(RaiseObjectionDialog);

  // const handleRaiseObjection =
  //   (userHasPermission: boolean, stakingAmounts: StakingAmounts) =>
  //     openRaiseObjectionDialog({
  //       motionId,
  //       colony,
  //       canUserStake: userHasPermission,
  //       scrollToRef,
  //       isDecision,
  //       ...stakingAmounts,
  //     }),
  // );

  return (
    <Button
      appearance={{ theme: 'pink', size: 'medium' }}
      text={{ id: 'button.object' }}
      disabled={!canUserStakeNay}
      onClick={() =>
        totalNAYStaked === '0'
          ? console.log('Wire in objection modal')
          : // ? handleRaiseObjection(canUserStake, {
            //     ...data.motionStakes,
            //     userActivatedTokens,
            //   })
            setIsSummary(true)
      }
      dataTest="stakeWidgetObjectButton"
    />
  );
};

ObjectButton.displayName = displayName;

export default ObjectButton;
