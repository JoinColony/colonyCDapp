import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { Id } from '@colony/colony-js';
import { string, object, boolean, number, InferType } from 'yup';

import Dialog, { DialogProps, ActionDialogProps } from '~shared/Dialog';
import { ActionHookForm as Form } from '~shared/Fields';

import { Color } from '~types';
import { ActionTypes } from '~redux/index';
import { WizardDialogType } from '~hooks'; // useEnabledExtensions
import { pipe, withMeta, mapPayload } from '~utils/actions';

import CreateDomainDialogForm from './CreateDomainDialogForm';
import { getCreateDomainDialogPayload } from './helpers';

type Props = DialogProps & WizardDialogType<object> & ActionDialogProps;

const displayName = 'common.CreateDomainDialog';

const validationSchema = object()
  .shape({
    forceAction: boolean().defined(),
    teamName: string().max(20).required(),
    domainColor: number().notRequired(),
    domainPurpose: string().max(90).notRequired(),
    annotationMessage: string().max(4000).notRequired(),
  })
  .defined();

type FormValues = InferType<typeof validationSchema>;

const CreateDomainDialog = ({
  callStep,
  prevStep,
  cancel,
  close,
  colony,
}: Props) => {
  const [isForce, setIsForce] = useState(false);
  const navigate = useNavigate();

  // const { isVotingExtensionEnabled } = useEnabledExtensions({
  //   colonyAddress: colony.colonyAddress,
  // });

  const getFormAction = (actionType: 'SUBMIT' | 'ERROR' | 'SUCCESS') => {
    const actionEnd = actionType === 'SUBMIT' ? '' : `_${actionType}`;

    return !isForce // && isVotingExtensionEnabled
      ? ActionTypes[`MOTION_DOMAIN_CREATE_EDIT${actionEnd}`]
      : ActionTypes[`ACTION_DOMAIN_CREATE${actionEnd}`];
  };

  const transform = pipe(
    mapPayload((payload) => getCreateDomainDialogPayload(colony, payload)),
    withMeta({ navigate }),
  );

  return (
    <Form<FormValues>
      defaultValues={{
        forceAction: false,
        teamName: '',
        domainColor: Color.LightPink,
        domainPurpose: '',
        annotationMessage: '',
        // motionDomainId: Id.RootDomain,
      }}
      submit={getFormAction('SUBMIT')}
      error={getFormAction('ERROR')}
      success={getFormAction('SUCCESS')}
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
            <CreateDomainDialogForm
              back={prevStep ? () => callStep(prevStep) : undefined}
              colony={colony}
            />
          </Dialog>
        );
      }}
    </Form>
  );
};

CreateDomainDialog.displayName = displayName;

export default CreateDomainDialog;
