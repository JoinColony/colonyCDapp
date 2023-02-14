import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { ColonyRole } from '@colony/colony-js';
import { useFormContext } from 'react-hook-form';

import DialogSection from '~shared/Dialog/DialogSection';
import { Annotations } from '~shared/Fields';
import { Heading3 } from '~shared/Heading';
import NoPermissionMessage from '~shared/NoPermissionMessage';
import { ActionDialogProps, DialogControls } from '~shared/Dialog';
import PermissionRequiredInfo from '~shared/PermissionRequiredInfo';
import { Tab, Tabs, TabList, TabPanel } from '~shared/Tabs';
import UploadAddresses from '~shared/UploadAddresses';
import { useAppContext, useTransformer } from '~hooks';
import { getAllUserRoles } from '~redux/transformers';
import { hasRoot } from '~utils/checks';
import { User } from '~types';

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
  backButtonText?: string;
}

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
}: Props) => {
  const { wallet, user } = useAppContext();
  const {
    getValues,
    formState: { errors, isSubmitting, isValid, isDirty },
    reset: resetForm,
  } = useFormContext();
  const values = getValues();
  const allUserRoles = useTransformer(getAllUserRoles, [
    colony,
    wallet?.address,
  ]);
  const hasRegisteredProfile = !!user?.name && !!wallet?.address;
  const userHasPermission = hasRegisteredProfile && hasRoot(allUserRoles);

  return (
    <>
      <DialogSection appearance={{ theme: 'heading' }}>
        <Heading3
          appearance={{ margin: 'none', theme: 'dark' }}
          text={MSG.title}
        />
      </DialogSection>
      {!userHasPermission && (
        <DialogSection>
          <PermissionRequiredInfo requiredRoles={[ColonyRole.Root]} />
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
          <TabList
            className={styles.tabsList}
            containerClassName={styles.tabsListContainer}
          >
            <Tab>
              <FormattedMessage {...MSG.addAddress} />
            </Tab>
            <Tab>
              <FormattedMessage {...MSG.whitelisted} />
            </Tab>
          </TabList>
          <TabPanel>
            <UploadAddresses
              userHasPermission={userHasPermission}
              errors={errors}
              isSubmitting={isSubmitting}
              showInput={showInput}
              toggleShowInput={toggleShowInput}
              formSuccess={formSuccess}
              setFormSuccess={(isSuccess) => setFormSuccess(isSuccess)}
              inputLabelMsg={MSG.inputLabel}
              inputSuccessMsg={MSG.inputSuccess}
              fileSuccessMsg={MSG.fileSuccess}
            />
            <Annotations
              label={MSG.annotation}
              name="annotation"
              disabled={!userHasPermission || isSubmitting}
            />
          </TabPanel>
          <TabPanel>
            {(whitelistedUsers?.length && (
              <>
                <ManageWhitelistActiveToggle
                  isWhitelistActivated={values.isWhitelistActivated}
                />
                <WhitelistedAddresses whitelistedUsers={whitelistedUsers} />
              </>
            )) || <NoWhitelistedAddressesState />}
            <Annotations
              label={MSG.annotation}
              name="annotation"
              disabled={!userHasPermission || isSubmitting}
            />
          </TabPanel>
        </Tabs>
      </DialogSection>
      {!userHasPermission && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <NoPermissionMessage requiredPermissions={[ColonyRole.Root]} />
        </DialogSection>
      )}
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <DialogControls
          secondaryButtonText={backButtonText}
          onSecondaryButtonClick={back}
          disabled={
            (tabIndex === 0 ? !values.whitelistAddress : !isDirty) ||
            !userHasPermission ||
            !isValid ||
            isSubmitting
          }
          dataTest="whitelistConfirmButton"
          submitButtonAppearance={{
            theme: tabIndex === TABS.ADD_ADDRESS ? 'primary' : 'pink',
            size: 'large',
          }}
        />
      </DialogSection>
    </>
  );
};

export default ManageWhitelistDialogForm;
