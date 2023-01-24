import React, { useCallback, useMemo, useState } from 'react';
import { defineMessages } from 'react-intl';
import { AddressZero } from '@ethersproject/constants';
import { useNavigate } from 'react-router-dom';
import { string, object, array, ObjectSchema, boolean } from 'yup';

import Dialog, { DialogProps, ActionDialogProps } from '~shared/Dialog';
import TokenEditDialog from '~shared/TokenEditDialog';
import { ActionHookForm as Form } from '~shared/Fields';

import { ActionTypes } from '~redux/index';
import { Address } from '~types/index';
import { pipe, mapPayload, withMeta } from '~utils/actions';
import { WizardDialogType } from '~hooks'; // useEnabledExtensions
import { createAddress } from '~utils/web3';
import { formatText } from '~utils/intl';

import getTokenList from './getTokenList';

const displayName = 'common.ColonyHome.TokenManagementDialog';

const MSG = defineMessages({
  errorAddingToken: {
    id: `${displayName}.errorAddingToken`,
    defaultMessage: `Sorry, there was an error adding this token. Learn more about tokens at: https://colony.io.`,
  },
});

type Props = DialogProps &
  Partial<WizardDialogType<object>> &
  ActionDialogProps;

export interface FormValues {
  forceAction: boolean;
  tokenAddress?: Address;
  selectedTokenAddresses?: Address[];
  annotationMessage?: string;
}

const validationSchema: ObjectSchema<FormValues> = object({
  forceAction: boolean().defined(),
  tokenAddress: string().address().notRequired(),
  selectedTokenAddresses: array()
    .of(string().address().defined())
    .notRequired(),
  annotationMessage: string().max(4000).notRequired(),
}).defined();

const TokenManagementDialog = ({
  colony: {
    colonyAddress,
    nativeToken,
    name: colonyName,
    tokens,
    // displayName: colonyDisplayName,
    // avatarURL,
    // avatarHash,
    // whitelistedAddresses,
    // isWhitelistActivated,
  },
  colony,
  cancel,
  close,
  callStep,
  prevStep,
}: Props) => {
  const [isForce, setIsForce] = useState(false);
  const navigate = useNavigate();
  const colonyTokens = useMemo(() => tokens?.items || [], [tokens]);

  // const { isVotingExtensionEnabled } = useEnabledExtensions({
  //   colonyAddress,
  // });

  const getFormAction = useCallback(
    (actionType: 'SUBMIT' | 'ERROR' | 'SUCCESS') => {
      const actionEnd = actionType === 'SUBMIT' ? '' : `_${actionType}`;

      return !isForce // && isVotingExtensionEnabled
        ? ActionTypes[`MOTION_EDIT_COLONY${actionEnd}`]
        : ActionTypes[`ACTION_EDIT_COLONY${actionEnd}`];
    },
    [isForce], // , isVotingExtensionEnabled
  );

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
                      address === nativeToken.tokenAddress
                    ) {
                      return false;
                    }
                    return true;
                  }),
              ),
            ];
            return {
              colonyAddress,
              colonyName,
              colonyDisplayName: colony.profile?.displayName,
              colonyAvatarImage: colony.profile?.thumbnail,
              colonyAvatarHash: colony.profile?.avatar,
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
    [colony, colonyAddress, colonyName, navigate, nativeToken],
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
        tokenAddress: undefined,
        selectedTokenAddresses: colonyTokens.map(
          (token) => token?.token.tokenAddress || '',
        ),
        annotationMessage: undefined,
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
      {({ formState, getValues }) => {
        const values = getValues();
        if (values.forceAction !== isForce) {
          setIsForce(values.forceAction);
        }
        return (
          <Dialog cancel={cancel}>
            <TokenEditDialog
              {...formState}
              values={values}
              colony={colony}
              back={prevStep && callStep ? () => callStep(prevStep) : undefined}
              tokensList={getTokenList()}
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
