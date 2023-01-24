import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { ColonyRole } from '@colony/colony-js';
import { FormState, UseFormReset } from 'react-hook-form';

import Button from '~shared/Button';
import DialogSection from '~shared/Dialog/DialogSection';
import { Annotations } from '~shared/Fields';
import { Heading3 } from '~shared/Heading';
import PermissionsLabel from '~shared/PermissionsLabel';
import PermissionRequiredInfo from '~shared/PermissionRequiredInfo';
import { Tab, Tabs, TabList, TabPanel } from '~shared/Tabs';
import UploadAddresses from '~shared/UploadAddresses';
import { useAppContext, useTransformer } from '~hooks';
import { getAllUserRoles } from '~redux/transformers';
import { hasRoot } from '~utils/checks';
import { Colony, User } from '~types';

import { FormValues, TABS } from './ManageWhitelistDialog';
import ManageWhitelistActiveToggle from './ManageWhitelistActiveToggle';
import WhitelistedAddresses from './WhitelistedAddresses';
import NoWhitelistedAddressesState from './NoWhitelistedAddressesState';

import styles from './ManageWhitelistDialogForm.css';

const displayName =
  'common.ColonyHome.ManageWhitelistDialog.ManageWhitelistDialogForm';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Manage address book',
  },
  annotation: {
    id: `${displayName}.annotation`,
    defaultMessage: 'Explain why you’re making these changes (optional)',
  },
  noPermission: {
    id: `${displayName}.noPermission`,
    defaultMessage: `You do not have the {roleRequired} permission required
      to take this action.`,
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

interface Props {
  back: () => void;
  colony: Colony;
  whitelistedUsers: User[];
  showInput: boolean;
  toggleShowInput: () => void;
  formSuccess: boolean;
  setFormSuccess: (isSuccess: boolean) => void;
  tabIndex: TABS;
  setTabIndex: (index: TABS) => void;
  values: FormValues;
  resetForm: UseFormReset<any>;
  backButtonText?: string;
}

const ManageWhitelistDialogForm = ({
  back,
  colony,
  values,
  whitelistedUsers,
  errors,
  isValid,
  isSubmitting,
  showInput,
  toggleShowInput,
  formSuccess,
  setFormSuccess,
  tabIndex,
  setTabIndex,
  resetForm,
  isDirty,
  backButtonText,
}: Props & FormState<FormValues>) => {
  const { wallet, user } = useAppContext();
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
                <WhitelistedAddresses
                  colony={colony}
                  whitelistedUsers={whitelistedUsers}
                />
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
          <div className={styles.noPermissionMessage}>
            <FormattedMessage
              {...MSG.noPermission}
              values={{
                roleRequired: (
                  <PermissionsLabel
                    permission={ColonyRole.Root}
                    name={{
                      id: `role.${ColonyRole.Root}`,
                    }}
                  />
                ),
              }}
            />
          </div>
        </DialogSection>
      )}
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <Button
          appearance={{ theme: 'secondary', size: 'large' }}
          onClick={back}
          text={{ id: backButtonText || 'button.back' }}
        />
        <Button
          appearance={{
            theme: tabIndex === TABS.ADD_ADDRESS ? 'primary' : 'pink',
            size: 'large',
          }}
          text={{ id: 'button.confirm' }}
          style={{ width: styles.wideButton }}
          disabled={
            (tabIndex === 0 ? !values.whitelistAddress : !isDirty) ||
            !userHasPermission ||
            !isValid ||
            isSubmitting
          }
          type="submit"
          loading={isSubmitting}
        />
      </DialogSection>
    </>
  );
};

export default ManageWhitelistDialogForm;
