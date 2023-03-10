import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { string, object, number, boolean, InferType } from 'yup';

import Dialog, { DialogProps, ActionDialogProps } from '~shared/Dialog';
import { ActionHookForm as Form } from '~shared/Fields';

import { ActionTypes } from '~redux/index';
import { WizardDialogType, useEnabledExtensions } from '~hooks';
import { pipe, withMeta, mapPayload } from '~utils/actions';
import { DomainColor } from '~gql';
import { findDomainByNativeId } from '~utils/domains';

import EditDomainDialogForm from './EditDomainDialogForm';
import { getEditDomainDialogPayload } from './helpers';

interface CustomWizardDialogProps extends ActionDialogProps {
  filteredDomainId?: number;
}

type Props = DialogProps &
  Partial<WizardDialogType<object>> &
  CustomWizardDialogProps;

const displayName = 'common.EditDomainDialog';

const validationSchema = object()
  .shape({
    forceAction: boolean().defined(),
    domainName: string().max(20).required(),
    domainId: number().required(),
    domainColor: string().defined(),
    domainPurpose: string().max(90),
    annotationMessage: string().max(4000),
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
}: Props) => {
  const selectedDomain = findDomainByNativeId(filteredDomainId, colony, true);

  const [isForce, setIsForce] = useState(false);
  const navigate = useNavigate();

  const { isVotingReputationEnabled } = useEnabledExtensions(colony);

  const actionType =
    !isForce && isVotingReputationEnabled
      ? ActionTypes.MOTION_DOMAIN_CREATE_EDIT
      : ActionTypes.ACTION_DOMAIN_EDIT;

  const transform = pipe(
    mapPayload((payload) => getEditDomainDialogPayload(colony, payload)),
    withMeta({ navigate }),
  );

  return (
    <Form<FormValues>
      defaultValues={{
        forceAction: false,
        domainName: selectedDomain?.metadata?.name || '',
        domainColor: selectedDomain?.metadata?.color || DomainColor.LightPink,
        domainPurpose: selectedDomain?.metadata?.description || '',
        annotationMessage: '',
        domainId: selectedDomain?.nativeId,
        motionDomainId: selectedDomain?.nativeId,
      }}
      actionType={actionType}
      validationSchema={validationSchema}
      transform={transform}
      onSuccess={close}
    >
      {({ getValues }) => {
        const forceActionValue = getValues('forceAction');
        if (forceActionValue !== isForce) {
          setIsForce(forceActionValue);
        }
        return (
          <Dialog cancel={cancel}>
            <EditDomainDialogForm
              back={prevStep && callStep ? () => callStep(prevStep) : undefined}
              colony={colony}
            />
          </Dialog>
        );
      }}
    </Form>
  );
};

EditDomainDialog.displayName = displayName;

export default EditDomainDialog;
