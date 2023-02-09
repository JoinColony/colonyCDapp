import { ColonyActionType } from './graphql';

type MotionsType = {
  [Key in keyof typeof ColonyActionType as `${Key}Motion`]: `${typeof ColonyActionType[Key]}_MOTION`;
};

export const ColonyMotions = Object.keys(ColonyActionType).reduce(
  (acc, actionTypeKey) => ({
    ...acc,
    [`${actionTypeKey}Motion`]: `${ColonyActionType[actionTypeKey]}_MOTION`,
  }),
  {} as MotionsType,
);

export type ColonyMotionsType =
  typeof ColonyMotions[keyof typeof ColonyMotions];

export const motionNameMapping = {
  mintTokens: ColonyMotions.MintTokensMotion,
  makePaymentFundedFromDomain: ColonyMotions.PaymentMotion,
  unlockToken: ColonyMotions.UnlockTokenMotion,
  addDomain: ColonyMotions.CreateDomainMotion,
  editDomain: ColonyMotions.EditDomainMotion,
  editColony: ColonyMotions.ColonyEditMotion,
  setUserRoles: ColonyMotions.SetUserRolesMotion,
  moveFundsBetweenPots: ColonyMotions.MoveFundsMotion,
  upgrade: ColonyMotions.VersionUpgradeMotion,
  emitDomainReputationPenalty: ColonyMotions.EmitDomainReputationPenaltyMotion,
  emitDomainReputationReward: ColonyMotions.EmitDomainReputationRewardMotion,
};
