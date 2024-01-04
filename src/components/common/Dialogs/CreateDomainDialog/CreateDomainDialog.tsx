import { Id } from '@colony/colony-js';
import React, { useState } from 'react';
import { defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { string, object, boolean, InferType, number } from 'yup';

import { MAX_ANNOTATION_LENGTH } from '~constants';
import { WizardDialogType } from '~hooks';
import { ActionTypes } from '~redux/index';
import Dialog, { DialogProps, ActionDialogProps } from '~shared/Dialog';
import { ActionForm } from '~shared/Fields';
import { DomainColor } from '~types';
import { pipe, withMeta, mapPayload } from '~utils/actions';

import CreateDomainDialogForm from './CreateDomainDialogForm';
import { getCreateDomainDialogPayload } from './helpers';

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
      .trim()
      .max(20)
      .required(() => MSG.requiredFieldError),
    domainColor: string().notRequired(),
    domainPurpose: string().trim().max(90).notRequired(),
    annotationMessage: string().max(MAX_ANNOTATION_LENGTH).notRequired(),
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
      <ActionForm<FormValues>
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
        <CreateDomainDialogForm
          back={prevStep && callStep ? () => callStep(prevStep) : undefined}
          colony={colony}
          enabledExtensionData={enabledExtensionData}
          handleIsForceChange={setIsForce}
          isForce={isForce}
        />
      </ActionForm>
    </Dialog>
  );
};

CreateDomainDialog.displayName = displayName;

export default CreateDomainDialog;
