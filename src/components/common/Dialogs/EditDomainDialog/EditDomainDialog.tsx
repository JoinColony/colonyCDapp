import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { string, object, number, boolean, InferType } from 'yup';
import { defineMessages } from 'react-intl';

import Dialog, { DialogProps, ActionDialogProps } from '~shared/Dialog';
import { ActionHookForm as Form } from '~shared/Fields';

import { ActionTypes } from '~redux';
import { WizardDialogType } from '~hooks';
import { pipe, withMeta, mapPayload } from '~utils/actions';
import { DomainColor } from '~gql';
import { findDomainByNativeId } from '~utils/domains';
import { notNull } from '~utils/arrays';
import { getDomainOptions } from '~shared/DomainFundSelectorSection/helpers';

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
      .max(20)
      .required(() => MSG.requiredFieldError),
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
  enabledExtensionData,
}: Props) => {
  const colonyDomains =
    colony.domains?.items.filter(notNull).filter(notRootDomain) || [];
  const domainOptions = getDomainOptions(colonyDomains);
  const selectedDomainId =
    filteredDomainId || Number(domainOptions[0]?.value) || null;
  const selectedDomain = findDomainByNativeId(selectedDomainId, colony);

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
      {({ watch }) => {
        const forceActionValue = watch('forceAction');
        if (forceActionValue !== isForce) {
          setIsForce(forceActionValue);
        }
        return (
          <Dialog cancel={cancel}>
            <EditDomainDialogForm
              back={prevStep && callStep ? () => callStep(prevStep) : undefined}
              colony={colony}
              domainOptions={domainOptions}
              enabledExtensionData={enabledExtensionData}
            />
          </Dialog>
        );
      }}
    </Form>
  );
};

EditDomainDialog.displayName = displayName;

export default EditDomainDialog;
