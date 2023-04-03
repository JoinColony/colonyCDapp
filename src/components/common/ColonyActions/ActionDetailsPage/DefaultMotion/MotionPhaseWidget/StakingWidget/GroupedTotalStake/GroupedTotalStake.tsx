import React from 'react';
import { object, string, InferType } from 'yup';

import { HookForm as Form } from '~shared/Fields';
import { StakeSide } from '~types/motions';

import { useStakingWidgetContext } from '../StakingWidgetProvider';
import { GroupedTotalStakeHeading, TotalStakeRadios, SubmitButton } from '.';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.StakingWidget.GroupedTotalStake';

const validationSchema = object()
  .shape({
    stakeSide: string().required().defined(),
  })
  .defined();

type GroupedTotalStakeVals = InferType<typeof validationSchema>;

const GroupedTotalStake = () => {
  const { setIsSummary, setIsObjection } = useStakingWidgetContext();

  const handleSubmit = ({ stakeSide }: { stakeSide: StakeSide }) => {
    setIsObjection(stakeSide === StakeSide.Objection);
    setIsSummary(false);
  };

  return (
    <Form<GroupedTotalStakeVals>
      defaultValues={{ stakeSide: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <GroupedTotalStakeHeading />
      <TotalStakeRadios />
      <SubmitButton />
    </Form>
  );
};

GroupedTotalStake.displayName = displayName;

export default GroupedTotalStake;
