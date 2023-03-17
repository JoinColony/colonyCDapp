import React from 'react';

import Button from '~shared/Button';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.StakingWidget.ObjectButton';

const ObjectButton = () => {
  //  const openRaiseObjectionDialog = useDialog(RaiseObjectionDialog);

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
      disabled={false}
      dataTest="stakeWidgetObjectButton"
    />
  );
};

ObjectButton.displayName = displayName;

export default ObjectButton;
