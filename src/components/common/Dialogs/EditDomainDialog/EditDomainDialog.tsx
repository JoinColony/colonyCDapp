import React, { useState } from 'react';
import { defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { string, object, number, boolean, InferType } from 'yup';

import { MAX_ANNOTATION_LENGTH } from '~constants';
import { DomainColor } from '~gql';
import { WizardDialogType } from '~hooks';
import { ActionTypes } from '~redux';
import Dialog, { DialogProps, ActionDialogProps } from '~shared/Dialog';
import { ActionForm } from '~shared/Fields';
import { pipe, withMeta, mapPayload } from '~utils/actions';
import { notNull } from '~utils/arrays';
import { findDomainByNativeId, getDomainOptions } from '~utils/domains';

import EditDomainDialogForm from './EditDomainDialogForm';
import { getEditDomainDialogPayload, notRootDomain } from './helpers';

interface CustomWizardDialogProps extends ActionDialogProps {
  filteredDomainId?: number;
}

type Props = DialogProps &
  Partial<WizardDialogType<object>> &
  CustomWizardDialogProps;

const displayName = 'common.EditDomainDialog';

const MSG = defineMessages({
  requiredFieldError: {
    id: `${displayName}.requiredFieldError`,
    defaultMessage: 'Please enter a value',
  },
});

const validationSchema = object()
  .shape({
    forceAction: boolean().defined(),
    domainName: string()
      .trim()
      .max(20)
      .required(() => MSG.requiredFieldError),
    domainId: number().required(),
    domainColor: string().defined(),
    domainPurpose: string().trim().max(90),
    annotationMessage: string().max(MAX_ANNOTATION_LENGTH),
    motionDomainId: number(),
  })
  .defined();

type FormValues = InferType<typeof validationSchema>;

const EditDomainDialog = ({
  callStep,
  prevStep,
  cancel,
  close,
  colony,
  filteredDomainId,
  enabledExtensionData,
}: Props) => {
  const colonyDomains =
    colony.domains?.items.filter(notNull).filter(notRootDomain) || [];
  const domainOptions = getDomainOptions(colonyDomains);
  const defaultDomainId =
    filteredDomainId || Number(domainOptions[0]?.value) || null;
  const { metadata, nativeId } =
    findDomainByNativeId(defaultDomainId, colony) ?? {};
  const {
    name = '',
    color = DomainColor.LightPink,
    description = '',
  } = metadata ?? {};

  const [isForce, setIsForce] = useState(false);
  const navigate = useNavigate();

  const { isVotingReputationEnabled } = enabledExtensionData;

  const actionType =
    !isForce && isVotingReputationEnabled
      ? ActionTypes.MOTION_DOMAIN_CREATE_EDIT
      : ActionTypes.ACTION_DOMAIN_EDIT;

  const transform = pipe(
    mapPayload((payload) => getEditDomainDialogPayload(colony, payload)),
    withMeta({ navigate }),
  );

  return (
    <Dialog cancel={cancel}>
      <ActionForm<FormValues>
        defaultValues={{
          forceAction: false,
          domainName: name,
          domainColor: color,
          domainPurpose: description,
          annotationMessage: '',
          domainId: nativeId,
          motionDomainId: nativeId,
        }}
        actionType={actionType}
        validationSchema={validationSchema}
        transform={transform}
        onSuccess={close}
      >
        <EditDomainDialogForm
          back={prevStep && callStep ? () => callStep(prevStep) : undefined}
          colony={colony}
          domainOptions={domainOptions}
          enabledExtensionData={enabledExtensionData}
          handleIsForceChange={setIsForce}
          isForce={isForce}
        />
      </ActionForm>
    </Dialog>
  );
};

EditDomainDialog.displayName = displayName;

export default EditDomainDialog;
