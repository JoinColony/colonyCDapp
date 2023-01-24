import React, { useCallback, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Id } from '@colony/colony-js';
import { string, object, number, boolean } from 'yup';

import Dialog, { DialogProps, ActionDialogProps } from '~shared/Dialog';
import { ActionHookForm as Form } from '~shared/Fields';

import { ActionTypes } from '~redux/index';
import { WizardDialogType } from '~hooks'; // useEnabledExtensions
import { pipe, withMeta, mapPayload } from '~utils/actions';
import { Color, graphQlDomainColorMap } from '~types';
import { DomainColor } from '~gql';

import EditDomainDialogForm from './EditDomainDialogForm';

export interface FormValues {
  forceAction: boolean;
  domainId: string | undefined;
  domainName: string | null | undefined;
  motionDomainId: number | undefined;
  domainColor: Color | null | undefined;
  domainPurpose: string | null | undefined;
  annotationMessage?: string;
}

interface CustomWizardDialogProps extends ActionDialogProps {
  filteredDomainId?: number;
}

type Props = DialogProps &
  Partial<WizardDialogType<object>> &
  CustomWizardDialogProps;

const displayName = 'common.ColonyHome.EditDomainDialog';

const validationSchema = object()
  .shape({
    forceAction: boolean().defined(),
    domainName: string().max(20).required(),
    domainId: string().required(),
    domainColor: number().defined(),
    domainPurpose: string().max(90),
    annotationMessage: string().max(4000),
    motionDomainId: number(),
  })
  .defined();

const EditDomainDialog = ({
  callStep,
  prevStep,
  cancel,
  close,
  colony,
  colony: { colonyAddress, name: colonyName, domains },
  filteredDomainId: preselectedDomainId,
}: Props) => {
  const colonyDomains = useMemo(() => domains?.items || [], [domains]);
  const selectedDomain = useMemo(
    () =>
      colonyDomains.find((domain) =>
        preselectedDomainId === 0 ||
        preselectedDomainId === undefined ||
        preselectedDomainId === Id.RootDomain
          ? domain?.nativeId !== Id.RootDomain
          : domain?.nativeId === preselectedDomainId,
      ),
    [preselectedDomainId, colonyDomains],
  );

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
        : ActionTypes[`ACTION_DOMAIN_EDIT${actionEnd}`];
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
          isCreateDomain: false,
        })),
        withMeta({ navigate }),
      ),
    [colonyAddress, colonyName, navigate],
  );

  return (
    <Form<FormValues>
      defaultValues={{
        forceAction: false,
        domainName: selectedDomain?.name,
        domainColor:
          graphQlDomainColorMap[selectedDomain?.color || DomainColor.Lightpink],
        domainPurpose: selectedDomain?.description,
        annotationMessage: undefined,
        domainId: selectedDomain?.nativeId.toString(),
        motionDomainId: selectedDomain?.nativeId,
      }}
      submit={getFormAction('SUBMIT')}
      error={getFormAction('ERROR')}
      success={getFormAction('SUCCESS')}
      validationSchema={validationSchema}
      transform={transform}
      onSuccess={close}
    >
      {({ formState, getValues, setValue }) => {
        const values = getValues();
        if (values.forceAction !== isForce) {
          setIsForce(values.forceAction);
        }
        return (
          <Dialog cancel={cancel}>
            <EditDomainDialogForm
              {...formState}
              values={values}
              setValue={setValue}
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
