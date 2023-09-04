import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { string, object, boolean, InferType, array } from 'yup';
import { defineMessages } from 'react-intl';

import { MAX_ANNOTATION_LENGTH } from '~constants';
import Dialog, { DialogProps, ActionDialogProps } from '~shared/Dialog';
import { ActionForm } from '~shared/Fields';

import { ActionTypes } from '~redux';
import { WizardDialogType } from '~hooks';
import { pipe, withMeta, mapPayload } from '~utils/actions';

import EditColonyDetailsDialogForm from './EditColonyDetailsDialogForm';
import { getEditColonyDetailsDialogPayload } from './helpers';
import { ExternalLinks } from '~gql';

type Props = Required<DialogProps> &
  WizardDialogType<object> &
  ActionDialogProps;

const displayName = 'common.EditColonyDetailsDialog';

const MSG = defineMessages({
  requiredFieldError: {
    id: `${displayName}.requiredFieldError`,
    defaultMessage: 'Please enter a value',
  },
});

const validationSchema = object()
  .shape({
    forceAction: boolean().defined(),
    colonyAvatarImage: string().nullable().defined(),
    colonyThumbnail: string().nullable().defined(),
    colonyDisplayName: string()
      .trim()
      .required(() => MSG.requiredFieldError),
    colonyDescription: string().defined(),
    annotationMessage: string().max(MAX_ANNOTATION_LENGTH).defined(),
    externalLinks: array()
      .of(
        object({
          name: string().defined().oneOf(Object.values(ExternalLinks)),
          link: string().when('name', {
            is: (name) => !!name,
            then: string().url().defined().required(),
            otherwise: string().url().defined(),
          }),
        }).defined(),
      )
      .defined(),
  })
  .defined();

type FormValues = InferType<typeof validationSchema>;

const EditColonyDetailsDialog = ({
  cancel,
  close,
  callStep,
  prevStep,
  colony: { metadata },
  colony,
  enabledExtensionData: { isVotingReputationEnabled },
  enabledExtensionData,
}: Props) => {
  const [isForce, setIsForce] = useState(false);
  const navigate = useNavigate();

  const actionType =
    !isForce && isVotingReputationEnabled
      ? ActionTypes.MOTION_EDIT_COLONY
      : ActionTypes.ACTION_EDIT_COLONY;

  const transform = pipe(
    mapPayload((payload) => getEditColonyDetailsDialogPayload(colony, payload)),
    withMeta({ navigate }),
  );

  return (
    <Dialog cancel={cancel}>
      <ActionForm<FormValues>
        defaultValues={{
          forceAction: false,
          colonyDisplayName: metadata?.displayName,
          colonyAvatarImage: metadata?.avatar,
          colonyThumbnail: metadata?.thumbnail,
          colonyDescription: metadata?.description ?? '',
          externalLinks: metadata?.externalLinks ?? [
            { name: ExternalLinks.Custom, link: '' },
          ],
          annotationMessage: '',
          /*
           * @NOTE That since this a root motion, and we don't actually make use
           * of the motion domain selected (it's disabled), we don't need to actually
           * pass the value over to the motion, since it will always be 1
           */
        }}
        actionType={actionType}
        validationSchema={validationSchema}
        onSuccess={close}
        transform={transform}
      >
        <EditColonyDetailsDialogForm
          colony={colony}
          back={() => callStep(prevStep)}
          enabledExtensionData={enabledExtensionData}
          isForce={isForce}
          setIsForce={setIsForce}
        />
      </ActionForm>
    </Dialog>
  );
};

EditColonyDetailsDialog.displayName = displayName;

export default EditColonyDetailsDialog;
