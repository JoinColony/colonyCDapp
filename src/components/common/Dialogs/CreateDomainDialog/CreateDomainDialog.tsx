import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { Id } from '@colony/colony-js';
import { string, object, boolean, number } from 'yup';

import Dialog, { DialogProps, ActionDialogProps } from '~shared/Dialog';
import { ActionHookForm as Form } from '~shared/Fields';

import { Color } from '~types';
import { ActionTypes } from '~redux/index';
import { WizardDialogType } from '~hooks'; // useEnabledExtensions
import { pipe, withMeta, mapPayload } from '~utils/actions';

import CreateDomainDialogForm from './CreateDomainDialogForm';

export interface FormValues {
  forceAction: boolean;
  teamName: string;
  domainColor?: Color;
  domainPurpose?: string;
  annotationMessage?: string;
}

type Props = DialogProps & WizardDialogType<object> & ActionDialogProps;

const displayName = 'common.ColonyHome.CreateDomainDialog';

const validationSchema = object()
  .shape({
    forceAction: boolean().defined(),
    teamName: string().max(20).required(),
    domainColor: number().notRequired(),
    domainPurpose: string().max(90).notRequired(),
    annotationMessage: string().max(4000).notRequired(),
  })
  .defined();

const CreateDomainDialog = ({
  callStep,
  prevStep,
  cancel,
  close,
  colony,
  colony: { colonyAddress, name: colonyName },
}: Props) => {
  const [isForce, setIsForce] = useState(false);
  const navigate = useNavigate();

  // const { isVotingExtensionEnabled } = useEnabledExtensions({
  //   colonyAddress: colony.colonyAddress,
  // });

  const getFormAction = useCallback(
    (actionType: 'SUBMIT' | 'ERROR' | 'SUCCESS') => {
      const actionEnd = actionType === 'SUBMIT' ? '' : `_${actionType}`;

      return !isForce // && isVotingExtensionEnabled
        ? ActionTypes[`MOTION_DOMAIN_CREATE_EDIT${actionEnd}`]
        : ActionTypes[`ACTION_DOMAIN_CREATE${actionEnd}`];
    },
    [isForce], // , isVotingExtensionEnabled
  );

  const transform = useCallback(
    () =>
      pipe(
        mapPayload((payload) => ({
          ...payload,
          colonyAddress,
          colonyName,
          domainName: payload.teamName,
          isCreateDomain: true,
        })),
        withMeta({ navigate }),
      ),
    [colonyAddress, colonyName, navigate],
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
      {({ formState, getValues }) => {
        const values = getValues();
        if (values.forceAction !== isForce) {
          setIsForce(values.forceAction);
        }
        return (
          <Dialog cancel={cancel}>
            <CreateDomainDialogForm
              {...formState}
              values={values}
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
