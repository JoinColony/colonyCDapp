import React from 'react';
import { Link } from 'react-router-dom';
import { MotionState as NetworkMotionState } from '@colony/colony-js';

import { Colony, ColonyMotion } from '~types';
import { useGetMotionStateQuery } from '~gql';
import { motionTags } from '~shared/Tag';
import { getMotionState } from '~utils/colonyMotions';
import MotionCountdown from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionCountdown';

import styles from './ExpenditureStages.module.css';

interface Props {
  colony: Colony;
  motion: ColonyMotion;
}

const MotionHistoryItem = ({ colony, motion }: Props) => {
  const { data: releaseExpenditureMotionStateQuery, refetch } =
    useGetMotionStateQuery({
      skip: !motion,
      variables: {
        input: {
          colonyAddress: colony.colonyAddress,
          databaseMotionId: motion?.databaseMotionId ?? '',
        },
      },
    });
  const releaseExpenditureStageMotionState =
    releaseExpenditureMotionStateQuery &&
    getMotionState(
      releaseExpenditureMotionStateQuery?.getMotionState ??
        NetworkMotionState.Null,
      motion,
    );

  if (!releaseExpenditureStageMotionState) {
    return null;
  }

  const ExpenditureStageTag =
    motionTags[releaseExpenditureStageMotionState ?? ''];

  return (
    <div key={motion.motionId} className={styles.motionHistoryItem}>
      <div>
        <Link to={`/colony/${colony.name}/tx/${motion.transactionHash}`}>
          <ExpenditureStageTag />
        </Link>
      </div>
      <MotionCountdown
        motionState={releaseExpenditureStageMotionState}
        refetchMotionState={refetch}
        motionData={motion}
      />
    </div>
  );
};

export default MotionHistoryItem;
