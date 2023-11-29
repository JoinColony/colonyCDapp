import React, { useState } from 'react';
import { Id } from '@colony/colony-js';
import { useNavigate } from 'react-router-dom';

import Dialog from '~shared/Dialog';
import { ActionForm } from '~shared/Fields';
import { ActionTypes } from '~redux/index';
import { pipe, withMeta, mapPayload } from '~utils/actions';
import { getVerifiedUsers } from '~utils/verifiedUsers';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { useSelectedUser } from '~hooks';
import { useMemberContext } from '~context/MemberContext';

import DialogForm from '../ManageReputationDialogForm';
import { AwardAndSmiteDialogProps } from '../types';

import { getManageReputationDialogPayload } from './helpers';

import {
  FormValues,
  defaultValidationSchema,
  getAmountValidationSchema,
} from './validation';

const displayName = 'common.ManageReputationContainer';

const ManageReputationContainer = ({
  colony: { nativeToken },
  colony,
  callStep,
  prevStep,
  cancel,
  close,
  filteredDomainId,
  isSmiteAction = false,
  enabledExtensionData,
}: AwardAndSmiteDialogProps) => {
  const [isForce, setIsForce] = useState(false);
  const [schemaUserReputation, setSchemaUserReputation] = useState(0);
  const navigate = useNavigate();
  const { members: allColonyMembers } = useMemberContext();

  const verifiedUsers = getVerifiedUsers(
    colony.metadata?.whitelistedAddresses ?? [],
    allColonyMembers,
  );

  const { isVotingReputationEnabled } = enabledExtensionData;

  const actionType =
    !isForce && isVotingReputationEnabled
      ? ActionTypes.MOTION_MANAGE_REPUTATION
      : ActionTypes.ACTION_MANAGE_REPUTATION;

  let smiteValidationSchema;

  if (isSmiteAction) {
    const amountValidationSchema =
      getAmountValidationSchema(schemaUserReputation);
    smiteValidationSchema = defaultValidationSchema.concat(
      amountValidationSchema,
    );
  }

  const nativeTokenDecimals = getTokenDecimalsWithFallback(
    nativeToken?.decimals,
  );

  const transform = pipe(
    mapPayload((payload) =>
      getManageReputationDialogPayload(
        colony,
        isSmiteAction,
        nativeTokenDecimals,
        payload,
      ),
    ),
    withMeta({ navigate }),
  );

  const { metadata } = colony;
  const selectedUser = useSelectedUser(
    metadata?.isWhitelistActivated ? verifiedUsers : allColonyMembers,
  );

  return (
    <Dialog cancel={cancel}>
      <ActionForm<FormValues>
        defaultValues={{
          forceAction: false,
          domainId: filteredDomainId || Id.RootDomain,
          user: selectedUser,
          motionDomainId: Id.RootDomain,
          amount: 0,
          annotation: '',
        }}
        actionType={actionType}
        validationSchema={smiteValidationSchema || defaultValidationSchema}
        onSuccess={close}
        transform={transform}
      >
        <DialogForm
          colony={colony}
          nativeTokenDecimals={nativeTokenDecimals}
          back={() => callStep(prevStep)}
          users={
            metadata?.isWhitelistActivated ? verifiedUsers : allColonyMembers
          }
          updateSchemaUserReputation={
            isSmiteAction ? setSchemaUserReputation : undefined
          }
          schemaUserReputation={schemaUserReputation}
          isSmiteAction={isSmiteAction}
          enabledExtensionData={enabledExtensionData}
          isForce={isForce}
          setIsForce={setIsForce}
        />
      </ActionForm>
    </Dialog>
  );
};

ManageReputationContainer.displayName = displayName;

export default ManageReputationContainer;
