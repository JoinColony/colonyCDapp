import React, { useState } from 'react';
import { Id } from '@colony/colony-js';
import { useNavigate } from 'react-router-dom';

import Dialog from '~shared/Dialog';
import { ActionHookForm as Form } from '~shared/Fields';

import { ActionTypes } from '~redux/index';
import { pipe, withMeta, mapPayload } from '~utils/actions';
// import { getVerifiedUsers } from '~utils/verifiedRecipients';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { useSelectedUser } from '~hooks';

import DialogForm from '../ManageReputationDialogForm';
import { AwardAndSmiteDialogProps } from '../types';

import {
  getManageReputationDialogPayload,
  useGetColonyMembers,
} from './helpers';

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
  const allColonyMembers = useGetColonyMembers(colony.colonyAddress);

  // const verifiedUsers = useMemo(() => {
  //   return getVerifiedUsers(colony.whitelistedAddresses, colonyWatchers) || [];
  // }, [colonyWatchers, colony]);

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

  // const { isWhitelistActivated } = colony;
  const selectedUser = useSelectedUser(allColonyMembers);
  //   isWhitelistActivated ? verifiedUsers : colonyWatchers,
  return (
    <Dialog cancel={cancel}>
      <Form<FormValues>
        defaultValues={{
          forceAction: false,
          domainId: filteredDomainId || Id.RootDomain,
          user: selectedUser,
          motionDomainId: (isSmiteAction && filteredDomainId) || Id.RootDomain,
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
            allColonyMembers // isWhitelistActivated ? verifiedUsers : colonyWatchers
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
      </Form>
    </Dialog>
  );
};

ManageReputationContainer.displayName = displayName;

export default ManageReputationContainer;
