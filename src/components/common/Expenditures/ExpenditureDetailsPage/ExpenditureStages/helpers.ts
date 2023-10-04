import { useGetMotionStateQuery } from '~gql';
import { Expenditure, ExpenditureStage } from '~types';
import { MotionState, getMotionState } from '~utils/colonyMotions';

export const useExpenditureStageStatus = (
  colonyAddress: string,
  expenditure: Expenditure,
  expenditureStage: ExpenditureStage | undefined,
) => {
  const releaseExpenditureStageMotion = expenditure.motions?.items.find(
    (motion) => motion?.expenditureSlotId === expenditureStage?.slotId,
  );

  const { data } = useGetMotionStateQuery({
    skip: !releaseExpenditureStageMotion,
    variables: {
      input: {
        colonyAddress,
        databaseMotionId: releaseExpenditureStageMotion?.databaseMotionId ?? '',
      },
    },
  });

  if (!releaseExpenditureStageMotion && expenditureStage?.isReleased) {
    return {
      expenditureStageStatus: MotionState.Forced,
    };
  }

  if (releaseExpenditureStageMotion && data?.getMotionState) {
    return {
      expenditureStageStatus: getMotionState(
        data.getMotionState,
        releaseExpenditureStageMotion,
      ),
      motionTransactionHash: releaseExpenditureStageMotion.transactionHash,
    };
  }

  return {
    expenditureStageStatus: null,
  };
};
