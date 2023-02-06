import React, { useCallback, useState } from 'react';
import { defineMessages } from 'react-intl';
import { AddressZero } from '@ethersproject/constants';
import { useNavigate } from 'react-router-dom';
import { string, object, array, boolean, InferType } from 'yup';

import Dialog, { DialogProps, ActionDialogProps } from '~shared/Dialog';
import TokenEditDialog from '~shared/TokenEditDialog';
import { ActionHookForm as Form } from '~shared/Fields';

import { ActionTypes } from '~redux/index';
import { pipe, mapPayload, withMeta } from '~utils/actions';
import { WizardDialogType } from '~hooks'; // useEnabledExtensions
import { createAddress } from '~utils/web3';
import { formatText } from '~utils/intl';

const displayName = 'common.TokenManagementDialog';

const MSG = defineMessages({
  errorAddingToken: {
    id: `${displayName}.errorAddingToken`,
    defaultMessage: `Sorry, there was an error adding this token. Learn more about tokens at: https://colony.io.`,
  },
});

type Props = DialogProps &
  Partial<WizardDialogType<object>> &
  ActionDialogProps;

const validationSchema = object({
  forceAction: boolean().defined(),
  tokenAddress: string().address().notRequired(),
  selectedTokenAddresses: array()
    .of(string().address().defined())
    .notRequired(),
  annotationMessage: string().max(4000).notRequired(),
}).defined();

type FormValues = InferType<typeof validationSchema>;

const TokenManagementDialog = ({
  colony,
  cancel,
  close,
  callStep,
  prevStep,
}: Props) => {
  const [isForce, setIsForce] = useState(false);
  const navigate = useNavigate();
  const colonyTokens = colony?.tokens?.items || [];

  // const { isVotingExtensionEnabled } = useEnabledExtensions({
  //   colonyAddress,
  // });

  const getFormAction = (actionType: 'SUBMIT' | 'ERROR' | 'SUCCESS') => {
    const actionEnd = actionType === 'SUBMIT' ? '' : `_${actionType}`;

    return !isForce // && isVotingExtensionEnabled
      ? ActionTypes[`MOTION_EDIT_COLONY${actionEnd}`]
      : ActionTypes[`ACTION_EDIT_COLONY${actionEnd}`];
  };

  const transform = useCallback(
    () =>
      pipe(
        mapPayload(
          ({ tokenAddress, selectedTokenAddresses, annotationMessage }) => {
            let addresses = selectedTokenAddresses;
            if (
              tokenAddress &&
              !selectedTokenAddresses.includes(tokenAddress)
            ) {
              addresses.push(tokenAddress);
            }
            addresses = [
              ...new Set(
                addresses
                  .map((address) => createAddress(address))
                  .filter((address) => {
                    if (
                      address === AddressZero ||
                      address === colony?.nativeToken.tokenAddress
                    ) {
                      return false;
                    }
                    return true;
                  }),
              ),
            ];
            return {
              colonyAddress: colony?.colonyAddress,
              colonyName: colony?.name,
              colonyDisplayName: colony?.profile?.displayName,
              colonyAvatarImage: colony?.profile?.thumbnail,
              colonyAvatarHash: colony?.profile?.avatar,
              hasAvatarChanged: false,
              colonyTokens: addresses,
              // verifiedAddresses: whitelistedAddresses,
              annotationMessage,
              // isWhitelistActivated,
            };
          },
        ),
        withMeta({ navigate }),
      ),
    [colony, navigate],
  );

  const handleSuccess = () => close();
  const handleError = (error, formHelpers) => {
    const { setError } = formHelpers;
    setError('tokenAddress', { message: formatText(MSG.errorAddingToken) });
  };

  return (
    <Form<FormValues>
      submit={getFormAction('SUBMIT')}
      success={getFormAction('SUCCESS')}
      error={getFormAction('ERROR')}
      defaultValues={{
        forceAction: false,
        tokenAddress: '',
        selectedTokenAddresses: colonyTokens.map(
          (token) => token?.token.tokenAddress || '',
        ),
        annotationMessage: '',
        /*
         * @NOTE That since this a root motion, and we don't actually make use
         * of the motion domain selected (it's disabled), we don't need to actually
         * pass the value over to the motion, since it will always be 1
         */
      }}
      validationSchema={validationSchema}
      transform={transform}
      onSuccess={handleSuccess}
      onError={handleError}
    >
      {({ getValues }) => {
        const forceActionValue = getValues('forceAction');
        if (forceActionValue !== isForce) {
          setIsForce(forceActionValue);
        }
        return (
          <Dialog cancel={cancel}>
            <TokenEditDialog
              colony={colony}
              back={prevStep && callStep ? () => callStep(prevStep) : undefined}
              close={close}
            />
          </Dialog>
        );
      }}
    </Form>
  );
};

TokenManagementDialog.displayName = displayName;

export default TokenManagementDialog;
