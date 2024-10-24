import React, { useMemo, type FC } from 'react';

import { usePaymentBuilderContext } from '~context/PaymentBuilderContext/PaymentBuilderContext.ts';
import { type ExpenditureAction } from '~types/graphql.ts';
import { notNull } from '~utils/arrays/index.ts';

import ActionWithPermissionsInfo from '../ActionWithPermissionsInfo/ActionWithPermissionsInfo.tsx';
import MotionBox from '../MotionBox/MotionBox.tsx';

import EditRequests from './partials/EditRequests/EditRequests.tsx';

interface EditStepProps {
  actions: ExpenditureAction[];
}

const EditStep: FC<EditStepProps> = ({ actions }) => {
  const { selectedEditingAction } = usePaymentBuilderContext();

  const { motionData: selectedEditingMotion } = selectedEditingAction ?? {};

  const sortedEditingActions = useMemo(
    () =>
      actions.filter(notNull).sort((a, b) => {
        if (a?.createdAt && b?.createdAt) {
          return Date.parse(b.createdAt) - Date.parse(a.createdAt);
        }
        return 0;
      }) ?? [],
    [actions],
  );

  return (
    <div className="flex flex-col gap-2">
      {actions && <EditRequests editingActions={sortedEditingActions} />}
      {selectedEditingMotion && (
        <MotionBox transactionId={selectedEditingMotion.transactionHash} />
      )}
      {selectedEditingAction && !selectedEditingMotion && (
        <ActionWithPermissionsInfo action={selectedEditingAction} />
      )}
    </div>
  );
};

export default EditStep;
