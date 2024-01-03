import React from 'react';

import { RefetchAction } from '~common/ColonyActions/ActionDetailsPage/useGetColonyAction';
import DetailItem from '~shared/DetailsWidget/DetailItem';
import { ColonyMotion } from '~types';
import { isEmpty } from '~utils/lodash';

import useClaimWidgetConfig from './useClaimWidgetConfig';

import styles from './ClaimMotionStakes.css';

const displayName = `common.ColonyActions.ActionDetailsPage.DefaultMotion.ClaimMotionStakes`;

interface ClaimMotionStakesProps {
  motionData: ColonyMotion;
  startPollingAction: (pollInterval: number) => void;
  refetchAction: RefetchAction;
}

export type ClaimMotionStakesStyles = typeof styles;

const ClaimMotionStakes = ({
  motionData,
  startPollingAction,
  refetchAction,
}: ClaimMotionStakesProps) => {
  const config = useClaimWidgetConfig(
    motionData,
    startPollingAction,
    refetchAction,
    styles,
  );

  if (isEmpty(config)) {
    return null;
  }

  return (
    <div>
      {config.map(({ label, labelStyles, item }) => (
        <DetailItem
          label={label}
          labelStyles={labelStyles}
          item={item}
          key={label as string} // safe casting as we don't interpolate complex values in useClaimWidgetConfig
        />
      ))}
    </div>
  );
};

ClaimMotionStakes.displayName = displayName;

export default ClaimMotionStakes;
