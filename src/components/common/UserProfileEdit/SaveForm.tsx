import React from 'react';
import { ApolloError } from '@apollo/client';
import { defineMessages } from 'react-intl';

import Button from '~shared/Button';
import Snackbar, { SnackbarType } from '~shared/Snackbar';

const displayName = 'common.UserProfileEdit.SaveForm';

const MSG = defineMessages({
  snackbarSuccess: {
    id: `${displayName}.snackbarSuccess`,
    defaultMessage: 'Profile settings have been updated.',
  },
  snackbarError: {
    id: `${displayName}.snackbarError`,
    defaultMessage: 'Profile settings were not able to be updated. Try again.',
  },
});

interface SaveFormProps {
  showSnackbar: boolean;
  setShowSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  disabled: boolean;
  error?: ApolloError;
  loading?: boolean;
  dataTest?: string;
}

const SaveForm = ({
  showSnackbar,
  setShowSnackbar,
  disabled,
  error,
  loading,
  dataTest,
}: SaveFormProps) => (
  <>
    <Button
      text={{ id: 'button.save' }}
      type="submit"
      onClick={() => {
        setShowSnackbar(true);
      }}
      disabled={disabled}
      loading={loading}
      dataTest={dataTest}
    />
    <Snackbar
      show={showSnackbar}
      setShow={setShowSnackbar}
      msg={error ? MSG.snackbarError : MSG.snackbarSuccess}
      type={error ? SnackbarType.Error : SnackbarType.Success}
    />
  </>
);

SaveForm.displayName = displayName;
export default SaveForm;
