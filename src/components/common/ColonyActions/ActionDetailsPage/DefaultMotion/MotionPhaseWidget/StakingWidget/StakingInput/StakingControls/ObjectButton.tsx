import React from 'react';

import { RaiseObjectionDialog } from '~common/Dialogs';
import Button from '~shared/Button';
import { useDialog } from '~shared/Dialog';

import { useStakingWidgetContext } from '../../StakingWidgetProvider';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.StakingWidget.ObjectButton';

const ObjectButton = () => {
  const openRaiseObjectionDialog = useDialog(RaiseObjectionDialog);
  const { canBeStaked } = useStakingWidgetContext();

  const handleObjection = () => {
    openRaiseObjectionDialog({ canBeStaked });
  };

  /* totalNAYStakes.isZero()
      ? openRaiseObjectionDialog({ stakingSliderProps })
      : setIsSummary(true); */

  return (
    <Button
      appearance={{ theme: 'pink', size: 'medium' }}
      text={{ id: 'button.object' }}
      disabled={false}
      dataTest="stakeWidgetObjectButton"
      onClick={handleObjection}
    />
  );
};

ObjectButton.displayName = displayName;

export default ObjectButton;
