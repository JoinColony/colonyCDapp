import Decimal from 'decimal.js';
import { BigNumber } from 'ethers';
import { useRef } from 'react';

import {
  getFinalStake,
  StakingSliderProps,
  SomeSliderAnnotationProps,
  SomeStakingValidationProps,
  SomeStakingWidgetSliderProps,
} from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/StakingWidget';
import { mapPayload } from '~utils/actions';
import { Address, MotionData, RemoveTypeName } from '~types';

export type MotionStakes = MotionData['motionStakes'];
export type UsersStakes = MotionData['usersStakes'];
type UserStakes = RemoveTypeName<UsersStakes[0]>;

enum MotionSide {
  YAY = 'yay',
  NAY = 'nay',
}

type AllStakingSliderProps = SomeSliderAnnotationProps &
  SomeStakingValidationProps &
  SomeStakingWidgetSliderProps & {
    mutableRef?: ReturnType<typeof useRef>;
  };

interface MotionStakingTransformProps {
  remainingToStake: Decimal;
  minUserStake: Decimal;
  userAddress: Address;
  colonyAddress: Address;
  motionId: string;
  vote: number;
}

export const mapStakingSliderProps = ({
  isObjection,
  minUserStake,
  remainingToStake,
  canBeStaked,
  maxUserStake,
  userActivatedTokens,
  nativeTokenDecimals,
  nativeTokenSymbol,
  totalPercentage,
  enoughTokens,
  reputationLoading,
  getErrorType,
  mutableRef,
}: AllStakingSliderProps): StakingSliderProps => ({
  stakingWidgetSliderProps: {
    isObjection,
    minUserStake,
    remainingToStake,
    canBeStaked,
    maxUserStake,
    userActivatedTokens,
  },
  sliderAnnotationProps: {
    enoughTokens,
    totalPercentage,
  },
  stakingValidationMessageProps: {
    getErrorType,
    nativeTokenDecimals,
    nativeTokenSymbol,
    reputationLoading,
  },
  mutableRef,
});

export const getMotionSide = (vote: number) =>
  vote === 0 ? MotionSide.NAY : MotionSide.YAY;

const getUpdatedUserStakes = (
  userStakes: MotionData['usersStakes'][0],
  newAmount: string,
  vote: number,
) => {
  const existingStakeAmount = userStakes.stakes.raw[getMotionSide(vote)];
  return {
    raw: {
      ...userStakes.stakes.raw,
      [getMotionSide(vote)]: new Decimal(existingStakeAmount)
        .add(newAmount)
        .toString(),
    },
  };
};

export const updateMotionStakes = (
  motionStakes: MotionStakes,
  finalStake: string,
  vote: number,
) => {
  const side = getMotionSide(vote);
  const updatedStake = new Decimal(motionStakes[side]).add(finalStake);

  return {
    ...motionStakes,
    [side]: updatedStake.toString(),
  };
};

export const updateUsersStakes = (
  usersStakes: UsersStakes,
  userAddress: Address,
  finalStake: string,
  vote: number,
) => {
  const isExistingUser = usersStakes.some(
    ({ address }) => address === userAddress,
  );

  if (isExistingUser) {
    return usersStakes.map((userStakes) => {
      if (userStakes.address === userAddress) {
        return {
          ...userStakes,
          stakes: getUpdatedUserStakes(userStakes, finalStake, vote),
        };
      }

      return userStakes;
    });
  }

  const rawStakes = {
    [getMotionSide(vote)]: finalStake,
    [getMotionSide(1 - vote)]: '0',
  } as UserStakes['stakes']['raw'];

  const newUserStakes: UserStakes = {
    address: userAddress,
    stakes: {
      raw: rawStakes,
    },
  };

  return [...usersStakes, newUserStakes];
};

export const getMotionStakingTransform = ({
  remainingToStake,
  minUserStake,
  userAddress,
  colonyAddress,
  motionId,
  vote,
}: MotionStakingTransformProps) =>
  mapPayload(
    ({
      amount,
      annotationMessage,
    }: {
      amount: number;
      annotationMessage?: string;
    }) => {
      const finalStake = getFinalStake(amount, remainingToStake, minUserStake);

      return {
        amount: finalStake,
        userAddress,
        colonyAddress,
        motionId: BigNumber.from(motionId),
        vote,
        annotationMessage,
      };
    },
  );
