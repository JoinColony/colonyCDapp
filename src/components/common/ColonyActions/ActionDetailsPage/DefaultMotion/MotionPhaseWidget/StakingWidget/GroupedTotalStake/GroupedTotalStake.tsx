import React from 'react';
import { object, string, InferType } from 'yup';

import { HookForm as Form } from '~shared/Fields';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.StakingWidget.GroupedTotalStake';

export enum StakeSide {
  Motion = 'MOTION',
  Objection = 'OBJECTION',
}

const validationSchema = object()
  .shape({
    stakeSide: string().required().defined(),
  })
  .defined();

type GroupedTotalStakeVals = InferType<typeof validationSchema>;

const GroupedTotalStake = () => {
  // const { setIsSummary, setIsObjection } = useStakingWidgetContext();

  //   const handleSubmit = ({ stakeSide }) => {
  //     setIsObjection(stakeSide === StakeSide.Objection);
  //     setIsSummary(false);
  //   };
  return (
    <Form<GroupedTotalStakeVals>
      defaultValues={{ stakeSide: '' }}
      validationSchema={validationSchema}
      onSubmit={() => {}} /* handleSubmit */
    >
      {/*
      <GroupedTotalStakeHeading />
      <TotalStakeRadios />
      <SubmitButton />
  */}
    </Form>
  );
};

GroupedTotalStake.displayName = displayName;

export default GroupedTotalStake;
