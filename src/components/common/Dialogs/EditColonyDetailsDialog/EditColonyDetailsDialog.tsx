import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { string, object, boolean } from 'yup';

import Dialog, { DialogProps, ActionDialogProps } from '~shared/Dialog';
import { ActionHookForm as Form } from '~shared/Fields';

// import { useColonyFromNameQuery } from '~data/index';
import { ActionTypes } from '~redux/index';
import { WizardDialogType } from '~hooks'; // useEnabledExtensions
import { pipe, withMeta, mapPayload } from '~utils/actions';

import EditColonyDetailsDialogForm from './EditColonyDetailsDialogForm';

export interface FormValues {
  forceAction: boolean;
  colonyDisplayName: string;
  colonyAvatarImage: string | null;
  annotationMessage: string;
}

type Props = Required<DialogProps> &
  WizardDialogType<object> &
  ActionDialogProps;

const displayName = 'common.EditColonyDetailsDialog';

const validationSchema = object()
  .shape({
    forceAction: boolean().defined(),
    colonyAvatarImage: string().nullable().defined(),
    colonyDisplayName: string().required(),
    annotationMessage: string().max(4000).defined(),
  })
  .defined();

const EditColonyDetailsDialog = ({
  cancel,
  close,
  callStep,
  prevStep,
  colony: { colonyAddress, name, profile, tokens, nativeToken },
  colony,
}: Props) => {
  const [isForce, setIsForce] = useState(false);
  const navigate = useNavigate();
  const colonyTokens = useMemo(() => tokens?.items || [], [tokens]);

  // const { data: colonyData } = useColonyFromNameQuery({
  //   variables: { name: colonyName, address: colonyAddress },
  // });

  // const { isVotingExtensionEnabled } = useEnabledExtensions({
  //   colonyAddress,
  // });

  const getFormAction = useCallback(
    (actionType: 'SUBMIT' | 'ERROR' | 'SUCCESS') => {
      const actionEnd = actionType === 'SUBMIT' ? '' : `_${actionType}`;

      return !isForce // isVotingExtensionEnabled &&
        ? ActionTypes[`MOTION_EDIT_COLONY${actionEnd}`]
        : ActionTypes[`ACTION_EDIT_COLONY${actionEnd}`];
    },
    [isForce], // isVotingExtensionEnabled,
  );

  const transform = useCallback(
    () =>
      pipe(
        mapPayload(
          ({
            colonyAvatarImage,
            colonyDisplayName: payloadDisplayName,
            annotationMessage,
          }) => ({
            colonyAddress,
            colonyName: name,
            colonyDisplayName: payloadDisplayName,
            colonyAvatarImage:
              typeof colonyAvatarImage === 'string' ||
              colonyAvatarImage === null
                ? colonyAvatarImage
                : profile?.thumbnail,
            colonyAvatarHash: profile?.avatar,
            hasAvatarChanged: !!(
              typeof colonyAvatarImage === 'string' ||
              colonyAvatarImage === null
            ),
            colonyTokens: colonyTokens.filter(
              (colonyToken) =>
                colonyToken?.token.tokenAddress !== nativeToken.tokenAddress,
            ),
            // verifiedAddresses: colonyData?.processedColony?.whitelistedAddresses,
            annotationMessage,
            // isWhitelistActivated:
            //   colonyData?.processedColony?.isWhitelistActivated,
          }),
        ),
        withMeta({ navigate }),
      ),
    [colonyAddress, colonyTokens, navigate, name, nativeToken, profile],
  );

  return (
    <Form<FormValues>
      defaultValues={{
        forceAction: false,
        colonyDisplayName: profile?.displayName || name,
        colonyAvatarImage: profile?.thumbnail || '',
        annotationMessage: '',
        /*
         * @NOTE That since this a root motion, and we don't actually make use
         * of the motion domain selected (it's disabled), we don't need to actually
         * pass the value over to the motion, since it will always be 1
         */
      }}
      submit={getFormAction('SUBMIT')}
      error={getFormAction('ERROR')}
      success={getFormAction('SUCCESS')}
      validationSchema={validationSchema}
      onSuccess={close}
      transform={transform}
    >
      {({ formState, getValues, setValue }) => {
        const values = getValues();
        if (values.forceAction !== isForce) {
          setIsForce(values.forceAction);
        }
        return (
          <Dialog cancel={cancel}>
            <EditColonyDetailsDialogForm
              {...formState}
              values={values}
              setValue={setValue}
              colony={colony}
              back={() => callStep(prevStep)}
            />
          </Dialog>
        );
      }}
    </Form>
  );
};

EditColonyDetailsDialog.displayName = displayName;

export default EditColonyDetailsDialog;
