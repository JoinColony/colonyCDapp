import React from 'react';
import { useFormContext } from 'react-hook-form';
import { defineMessages } from 'react-intl';

import {
  StakeSide,
  useStakingWidgetContext,
} from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/StakingWidget';
import { useAppContext } from '~hooks';
import { CustomRadioAppearance } from '~shared/Fields/Radio';
import Icon from '~shared/Icon';
import Numeral from '~shared/Numeral';

const displayName = 'hooks.motionWidgets.stakingWidget.useTotalStakeRadios';

const MSG = defineMessages({
  YAYName: {
    id: `${displayName}.YAYName`,
    defaultMessage: 'Motion {fullyStakedEmoji}',
  },
  NAYName: {
    id: `${displayName}.NAYName`,
    defaultMessage: 'Objection {fullyStakedEmoji}',
  },
  stakeProgress: {
    id: `${displayName}.stakeProgress`,
    defaultMessage: '{totalPercentage}% of {requiredStake}',
  },
  fullyStaked: {
    id: `${displayName}.fullyStaked`,
    defaultMessage: 'Fully staked',
  },
});

const useTotalStakeRadios = () => {
  const {
    yayPercentage,
    nayPercentage,
    nativeTokenSymbol,
    nativeTokenDecimals,
    requiredStake,
  } = useStakingWidgetContext();
  const { getValues } = useFormContext();
  const { stakeSide } = getValues();
  const { user } = useAppContext();
  const isYAYSideFullyStaked = yayPercentage === '100';
  const isNAYSideFullyStaked = nayPercentage === '100';

  const radioConfig = [
    {
      value: StakeSide.Motion,
      description: isYAYSideFullyStaked ? MSG.fullyStaked : MSG.stakeProgress,
      descriptionValues: {
        totalPercentage: yayPercentage,
        requiredStake: (
          <Numeral
            value={requiredStake}
            suffix={nativeTokenSymbol}
            decimals={nativeTokenDecimals}
          />
        ),
      },
      label: MSG.YAYName,
      labelValues: {
        fullyStakedEmoji: isYAYSideFullyStaked ? (
          <Icon name="circle-check-primary" title={MSG.fullyStaked} />
        ) : null,
      },
      appearance: { theme: 'primary' } as CustomRadioAppearance,
      disabled: isYAYSideFullyStaked || !user,
    },
    {
      value: StakeSide.Objection,
      description: isNAYSideFullyStaked ? MSG.fullyStaked : MSG.stakeProgress,
      descriptionValues: {
        totalPercentage: nayPercentage,
        requiredStake: (
          <Numeral
            value={requiredStake}
            suffix={nativeTokenSymbol}
            decimals={nativeTokenDecimals}
          />
        ),
      },
      label: MSG.NAYName,
      labelValues: {
        fullyStakedEmoji: isNAYSideFullyStaked ? (
          <Icon name="circle-check-primary" title={MSG.fullyStaked} />
        ) : null,
      },
      appearance: { theme: 'danger' } as CustomRadioAppearance,
      disabled: isNAYSideFullyStaked || !user,
    },
  ];

  return { radioConfig, stakeSide };
};

export default useTotalStakeRadios;
