import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Id } from '@colony/colony-js';
import { string, object, boolean, InferType, number } from 'yup';
import { defineMessages } from 'react-intl';

import Dialog, { DialogProps, ActionDialogProps } from '~shared/Dialog';
import { ActionHookForm as Form } from '~shared/Fields';

import { DomainColor } from '~types';
import { ActionTypes } from '~redux/index';
import { WizardDialogType } from '~hooks';
import { pipe, withMeta, mapPayload } from '~utils/actions';

import { getCreateDomainDialogPayload } from './helpers';
import CreateDomainDialogForm from './CreateDomainDialogForm';

type Props = DialogProps &
  Partial<WizardDialogType<object>> &
  ActionDialogProps;

const displayName = 'common.CreateDomainDialog';

const MSG = defineMessages({
  requiredFieldError: {
    id: `${displayName}.requiredFieldError`,
    defaultMessage: 'Please enter a value',
  },
});

const validationSchema = object()
  .shape({
    forceAction: boolean().defined(),
    teamName: string()
      .max(20)
      .required(() => MSG.requiredFieldError),
    domainColor: string().notRequired(),
    domainPurpose: string().max(90).notRequired(),
    annotationMessage: string().max(4000).notRequired(),
    motionDomainId: number().defined(),
  })
  .defined();

type FormValues = InferType<typeof validationSchema>;

const CreateDomainDialog = ({
  callStep,
  prevStep,
  cancel,
  close,
  colony,
  enabledExtensionData,
}: Props) => {
  const [isForce, setIsForce] = useState(false);
  const navigate = useNavigate();

  const { isVotingReputationEnabled } = enabledExtensionData;

  const actionType =
    !isForce && isVotingReputationEnabled
      ? ActionTypes.MOTION_DOMAIN_CREATE_EDIT
      : ActionTypes.ACTION_DOMAIN_CREATE;

  const transform = pipe(
    mapPayload((payload) => getCreateDomainDialogPayload(colony, payload)),
    withMeta({ navigate }),
  );

  return (
    <Dialog cancel={cancel}>
      <Form<FormValues>
        defaultValues={{
          forceAction: false,
          teamName: '',
          domainColor: DomainColor.LightPink,
          domainPurpose: '',
          annotationMessage: '',
          motionDomainId: Id.RootDomain,
        }}
        actionType={actionType}
        validationSchema={validationSchema}
        transform={transform}
        onSuccess={close}
      >
        {() => (
          <CreateDomainDialogForm
            back={prevStep && callStep ? () => callStep(prevStep) : undefined}
            colony={colony}
            enabledExtensionData={enabledExtensionData}
            handleIsForceChange={setIsForce}
            isForce={isForce}
          />
        )}
      </Form>
    </Dialog>
  );
};

CreateDomainDialog.displayName = displayName;

export default CreateDomainDialog;
