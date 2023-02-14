import React, { useState } from 'react';
import { string, object, array, boolean, InferType } from 'yup';
import { useNavigate } from 'react-router-dom';
import { defineMessages } from 'react-intl';

import { isAddress } from '~utils/web3';
import Dialog, { ActionDialogProps, DialogProps } from '~shared/Dialog';
import { ActionHookForm as Form } from '~shared/Fields';

// import {
//   useVerifiedUsersQuery,
//   useColonyFromNameQuery,
// } from '~data/index';
import { ActionTypes } from '~redux/index';
import { WizardDialogType } from '~hooks';
import { pipe, withMeta, mapPayload } from '~utils/actions';
import { formatText } from '~utils/intl';
import { isEmpty } from '~utils/lodash';

import ManageWhitelistDialogForm from './ManageWhitelistDialogForm';
import { getManageWhitelistDialogPayload, TABS } from './helpers';

type Props = Required<DialogProps> &
  WizardDialogType<object> &
  ActionDialogProps & {
    userAddress?: string;
  };

const displayName = 'common.ManageWhitelistDialog';

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

const validationSchema = object({
  whitelistAddress: string()
    .required(() => formatText(MSG.requiredField))
    .address(),
  whitelistCSVUploader: object()
    .defined()
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
    .nullable(),
  whitelistedAddresses: array().of(string().address().defined()),
  annotation: string().max(4000).defined(),
  isWhitelistActivated: boolean().defined(),
}).defined();

type FormValues = InferType<typeof validationSchema>;

const ManageWhitelistDialog = ({
  cancel,
  close,
  callStep,
  prevStep,
  colony,
  userAddress,
}: Props) => {
  const [showInput, setShowInput] = useState<boolean>(true);
  const [formSuccess, setFormSuccess] = useState<boolean>(false);
  const [tabIndex, setTabIndex] = useState<number>(TABS.ADD_ADDRESS);

  const handleToggleShowInput = () => {
    setShowInput((state) => !state);
    // clear success msgs when switching inputs
    setFormSuccess(false);
  };

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

  const getFormAction = (actionType: 'SUBMIT' | 'ERROR' | 'SUCCESS') => {
    const actionEnd = actionType === 'SUBMIT' ? '' : `_${actionType}`;

    return ActionTypes[`VERIFIED_RECIPIENTS_MANAGE${actionEnd}`];
  };

  const transform = pipe(
    mapPayload((payload) =>
      getManageWhitelistDialogPayload(colony, tabIndex, payload),
    ),
    withMeta({ navigate }),
  );

  return (
    <Form<FormValues>
      defaultValues={{
        annotation: '',
        isWhitelistActivated: false, // colonyData?.processedColony?.isWhitelistActivated,
        whitelistedAddresses: [], // storedVerifiedRecipients,
        whitelistAddress: userAddress,
        whitelistCSVUploader: null,
      }}
      submit={getFormAction('SUBMIT')}
      error={getFormAction('ERROR')}
      success={getFormAction('SUCCESS')}
      validationSchema={validationSchema}
      transform={transform}
      onSuccess={() => {
        if (tabIndex === TABS.ADD_ADDRESS) {
          setFormSuccess(true);
        }
        close();
      }}
    >
      <Dialog cancel={cancel}>
        <ManageWhitelistDialogForm
          colony={colony}
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
    </Form>
  );
};

ManageWhitelistDialog.displayName = displayName;

export default ManageWhitelistDialog;
