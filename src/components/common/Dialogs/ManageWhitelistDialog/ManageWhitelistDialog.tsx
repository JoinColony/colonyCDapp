import React, { useCallback, useMemo, useState } from 'react';
import { string, object, array, boolean } from 'yup';
import { useNavigate } from 'react-router-dom';
import { defineMessages } from 'react-intl';

import { isAddress } from '~utils/web3';
import Dialog, { DialogProps } from '~shared/Dialog';
import { ActionHookForm as Form } from '~shared/Fields';

// import {
//   useVerifiedUsersQuery,
//   useColonyFromNameQuery,
// } from '~data/index';
import { ActionTypes } from '~redux/index';
import { WizardDialogType } from '~hooks';
import { pipe, withMeta, mapPayload } from '~utils/actions';
import { Address } from '~types/index';
import { Colony } from '~types';
import { formatText } from '~utils/intl';
import { isEmpty } from '~utils/lodash';

import ManageWhitelistDialogForm from './ManageWhitelistDialogForm';

export enum TABS {
  ADD_ADDRESS = 0,
  WHITELISTED = 1,
}
export interface FormValues {
  annotation: string;
  isWhitelistActivated: boolean;
  whitelistedAddresses: Address[];
  whitelistAddress: Address;
}

interface CustomWizardDialogProps {
  colony: Colony;
  userAddress?: string;
}

type Props = DialogProps &
  Partial<WizardDialogType<object>> &
  CustomWizardDialogProps;

const displayName = 'common.ColonyHome.ManageWhitelistDialog';

const MSG = defineMessages({
  requiredField: {
    id: `${displayName}.requiredField`,
    defaultMessage: `Wallet address is a required field.`,
  },
  uploadError: {
    id: `${displayName}.uploadError`,
    defaultMessage: `We do not accept more than 100 addresses at a time, please upload a smaller amount.`,
  },
  badFileError: {
    id: `${displayName}.badFileError`,
    defaultMessage: `.csv invalid or incomplete. Please ensure the file contains a single column with one address on each row.`,
  },
  invalidAddressError: {
    id: `${displayName}.invalidAddressError`,
    defaultMessage: `It looks like one of your addresses is invalid. Please review our required format & validate that your file matches our requirement. Once fixed, please try again.`,
  },
});

const ManageWhitelistDialog = ({
  cancel,
  close,
  callStep,
  prevStep,
  colony,
  colony: { name: colonyName, tokens, nativeToken, colonyAddress },
  userAddress,
}: Props) => {
  const [showInput, setShowInput] = useState<boolean>(true);
  const [formSuccess, setFormSuccess] = useState<boolean>(false);
  const [tabIndex, setTabIndex] = useState<number>(TABS.ADD_ADDRESS);
  const colonyTokens = useMemo(() => tokens?.items || [], [tokens]);
  const handleToggleShowInput = useCallback(() => {
    setShowInput((state) => !state);
    // clear success msgs when switching inputs
    setFormSuccess(false);
  }, [setShowInput, setFormSuccess]);

  const navigate = useNavigate();

  // const { data: colonyData } = useColonyFromNameQuery({
  //   variables: { name: colonyName, address: colonyAddress },
  // });

  // const { data } = useVerifiedUsersQuery({
  //   variables: {
  //     verifiedAddresses:
  //       colonyData?.processedColony?.whitelistedAddresses || [],
  //   },
  // });

  // const storedVerifiedRecipients = useMemo(
  //   () =>
  //     (data?.verifiedUsers || []).map((user: User) => user?.id),
  //   [data],
  // );

  const handleTabChange = (index: number) => {
    setFormSuccess(false);
    setTabIndex(index);
  };

  const validationSchema = object({
    whitelistAddress: string()
      .required(() => formatText(MSG.requiredField))
      .address(),
    whitelistCSVUploader: object()
      .shape({
        parsedData: array()
          .of(string().address().defined())
          .min(1, () => formatText(MSG.badFileError))
          .max(1000, () => formatText(MSG.uploadError))
          .test(
            'valid-wallet-addresses',
            () => formatText(MSG.invalidAddressError),
            (value) =>
              isEmpty(
                value?.filter(
                  (potentialAddress: string) => !isAddress(potentialAddress),
                ),
              ),
          )
          .defined(),
      })
      .defined(),
    whitelistedAddresses: array()
      .ensure()
      .of(string().address().defined())
      .defined(),
    annotation: string().max(4000).defined(),
    isWhitelistActivated: boolean().defined(),
  }).defined();

  const transform = useCallback(
    () =>
      pipe(
        mapPayload(
          ({
            annotation: annotationMessage,
            // whitelistAddress,
            whitelistedAddresses,
            // whitelistCSVUploader,
            isWhitelistActivated,
          }) => {
            let verifiedAddresses: Address[];
            let whitelistActivated = false;
            if (tabIndex === TABS.WHITELISTED) {
              verifiedAddresses = whitelistedAddresses;
              whitelistActivated = isWhitelistActivated;
            } else {
              verifiedAddresses = [];
              // whitelistAddress !== undefined
              //   ? [...new Set([...storedVerifiedRecipients, whitelistAddress])]
              //   : [
              //       ...new Set([
              //         ...storedVerifiedRecipients,
              //         ...whitelistCSVUploader[0].parsedData,
              //       ]),
              //     ];
              if (verifiedAddresses.length) {
                whitelistActivated = true;
              }
            }
            return {
              colonyAddress,
              colonyDisplayName: colony.profile?.displayName,
              colonyAvatarHash: colony.profile?.avatar,
              verifiedAddresses,
              isWhitelistActivated: whitelistActivated,
              annotationMessage,
              colonyName,
              colonyTokens: colonyTokens.filter(
                (token) =>
                  token?.token.tokenAddress !== nativeToken.tokenAddress,
              ),
            };
          },
        ),
        withMeta({ navigate }),
      ),
    [
      tabIndex,
      colony,
      navigate,
      colonyAddress,
      colonyName,
      colonyTokens,
      nativeToken.tokenAddress,
    ], // storedVerifiedRecipients
  );

  return (
    <Form<FormValues>
      defaultValues={{
        annotation: '',
        isWhitelistActivated: false, // colonyData?.processedColony?.isWhitelistActivated,
        whitelistedAddresses: [], // storedVerifiedRecipients,
        whitelistAddress: userAddress,
      }}
      submit={ActionTypes.VERIFIED_RECIPIENTS_MANAGE}
      error={ActionTypes.VERIFIED_RECIPIENTS_MANAGE_ERROR}
      success={ActionTypes.VERIFIED_RECIPIENTS_MANAGE_SUCCESS}
      validationSchema={validationSchema}
      transform={transform}
      onSuccess={() => {
        if (tabIndex === TABS.ADD_ADDRESS) {
          setFormSuccess(true);
        }
        close();
      }}
    >
      {({ formState, getValues, reset }) => {
        const values = getValues();
        return (
          <Dialog cancel={cancel}>
            <ManageWhitelistDialogForm
              {...formState}
              errors={formState.errors}
              values={values}
              colony={colony}
              resetForm={reset}
              whitelistedUsers={[]} // data?.verifiedUsers ||
              back={prevStep && callStep ? () => callStep(prevStep) : cancel}
              showInput={showInput}
              toggleShowInput={handleToggleShowInput}
              formSuccess={formSuccess}
              setFormSuccess={(isSuccess) => setFormSuccess(isSuccess)}
              tabIndex={tabIndex}
              setTabIndex={handleTabChange}
              backButtonText={!prevStep ? 'button.cancel' : 'button.back'}
            />
          </Dialog>
        );
      }}
    </Form>
  );
};

ManageWhitelistDialog.displayName = displayName;

export default ManageWhitelistDialog;
