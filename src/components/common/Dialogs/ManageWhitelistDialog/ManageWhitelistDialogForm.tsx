import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { ColonyRole, Id } from '@colony/colony-js';
import { useFormContext } from 'react-hook-form';

import DialogSection from '~shared/Dialog/DialogSection';
import { Annotations } from '~shared/Fields';
import { Heading3 } from '~shared/Heading';

import { ActionDialogProps, DialogControls } from '~shared/Dialog';
import { Tab, Tabs, TabList, TabPanel } from '~shared/Tabs';
import UploadAddresses from '~shared/UploadAddresses';
import { useActionDialogStatus } from '~hooks';
import { Message, User } from '~types';

import { NoPermissionMessage, PermissionRequiredInfo } from '../Messages';

import ManageWhitelistActiveToggle from './ManageWhitelistActiveToggle';
import WhitelistedAddresses from './WhitelistedAddresses';
import NoWhitelistedAddressesState from './NoWhitelistedAddressesState';
import { TABS } from './helpers';

import styles from './ManageWhitelistDialogForm.css';

const displayName = 'common.ManageWhitelistDialog.ManageWhitelistDialogForm';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Manage address book',
  },
  annotation: {
    id: `${displayName}.annotation`,
    defaultMessage: 'Explain why you’re making these changes (optional)',
  },
  addAddress: {
    id: `${displayName}.addAddress`,
    defaultMessage: 'Add address',
  },
  whitelisted: {
    id: `${displayName}.whitelisted`,
    defaultMessage: 'Address book',
  },
  inputLabel: {
    id: `${displayName}.inputLabel`,
    defaultMessage: `Add wallet address to address book.`,
  },
  inputSuccess: {
    id: `${displayName}.inputSuccess`,
    defaultMessage: `Address was added. You can add another one or close modal.`,
  },
  fileSuccess: {
    id: `${displayName}.fileSuccess`,
    defaultMessage: `File was added. You can add another one or close modal.`,
  },
});

interface Props extends ActionDialogProps {
  whitelistedUsers: User[];
  showInput: boolean;
  toggleShowInput: () => void;
  formSuccess: boolean;
  setFormSuccess: (isSuccess: boolean) => void;
  tabIndex: TABS;
  setTabIndex: (index: TABS) => void;
  backButtonText?: Message;
}

const requiredRoles = [ColonyRole.Root];

const ManageWhitelistDialogForm = ({
  back,
  colony,
  whitelistedUsers,
  showInput,
  toggleShowInput,
  formSuccess,
  setFormSuccess,
  tabIndex,
  setTabIndex,
  backButtonText,
  enabledExtensionData,
}: Props) => {
  const {
    watch,
    formState: { errors, isDirty },
    reset: resetForm,
  } = useFormContext();
  const isWhitelistActivated = watch('isWhitelistActivated');
  const { userHasPermission, disabledSubmit, disabledInput } = useActionDialogStatus(
    colony,
    requiredRoles,
    [Id.RootDomain],
    enabledExtensionData,
  );

  return (
    <>
      <DialogSection appearance={{ theme: 'heading' }}>
        <Heading3 appearance={{ margin: 'none', theme: 'dark' }} text={MSG.title} />
      </DialogSection>
      {!userHasPermission && (
        <DialogSection>
          <PermissionRequiredInfo requiredRoles={requiredRoles} />
        </DialogSection>
      )}
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <Tabs
          selectedIndex={tabIndex}
          onSelect={(newIndex) => {
            setTabIndex(newIndex);
            resetForm();
          }}
        >
          <TabList className={styles.tabsList} containerClassName={styles.tabsListContainer}>
            <Tab>
              <FormattedMessage {...MSG.addAddress} />
            </Tab>
            <Tab>
              <FormattedMessage {...MSG.whitelisted} />
            </Tab>
          </TabList>
          <TabPanel>
            <UploadAddresses
              errors={errors}
              showInput={showInput}
              toggleShowInput={toggleShowInput}
              formSuccess={formSuccess}
              setFormSuccess={(isSuccess) => setFormSuccess(isSuccess)}
              inputLabelMsg={MSG.inputLabel}
              inputSuccessMsg={MSG.inputSuccess}
              fileSuccessMsg={MSG.fileSuccess}
              disabledInput={disabledInput}
            />
            <Annotations label={MSG.annotation} name="annotation" disabled={disabledInput} />
          </TabPanel>
          <TabPanel>
            {(whitelistedUsers?.length && (
              <>
                <ManageWhitelistActiveToggle isWhitelistActivated={isWhitelistActivated} />
                <WhitelistedAddresses whitelistedUsers={whitelistedUsers} />
                <Annotations label={MSG.annotation} name="annotation" disabled={disabledInput} />
              </>
            )) || <NoWhitelistedAddressesState />}
          </TabPanel>
        </Tabs>
      </DialogSection>
      {!userHasPermission && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <NoPermissionMessage requiredPermissions={requiredRoles} />
        </DialogSection>
      )}
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <DialogControls
          secondaryButtonText={backButtonText}
          onSecondaryButtonClick={back}
          disabled={!isDirty || disabledSubmit}
          dataTest="whitelistConfirmButton"
          submitButtonAppearance={{
            theme: tabIndex === TABS.ADD_ADDRESS ? 'primary' : 'pink',
            size: 'large',
          }}
          isVotingReputationEnabled={enabledExtensionData.isVotingReputationEnabled}
        />
      </DialogSection>
    </>
  );
};

export default ManageWhitelistDialogForm;
