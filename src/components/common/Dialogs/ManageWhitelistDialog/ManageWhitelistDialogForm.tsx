import { ColonyRole, Id } from '@colony/colony-js';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage, defineMessages } from 'react-intl';

import { useActionDialogStatus } from '~hooks';
import { ActionDialogProps, DialogControls } from '~shared/Dialog';
import DialogSection from '~shared/Dialog/DialogSection';
import { Annotations } from '~shared/Fields';
import { Heading3 } from '~shared/Heading';
import { Tab, Tabs, TabList, TabPanel } from '~shared/Tabs';
import UploadAddresses from '~shared/UploadAddresses';
import { Address, Message } from '~types';

import { NoPermissionMessage, PermissionRequiredInfo } from '../Messages';

import { TABS } from './helpers';
import ManageWhitelistActiveToggle from './ManageWhitelistActiveToggle';
import NoWhitelistedAddressesState from './NoWhitelistedAddressesState';
import WhitelistedAddresses from './WhitelistedAddresses';

import styles from './ManageWhitelistDialogForm.css';

const displayName = 'common.ManageWhitelistDialog.ManageWhitelistDialogForm';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Manage address book',
  },
  annotation: {
    id: `${displayName}.annotation`,
    defaultMessage: "Explain why you're making these changes (optional)",
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
  showInput: boolean;
  toggleShowInput: () => void;
  formSuccess: boolean;
  setFormSuccess: (isSuccess: boolean) => void;
  tabIndex: TABS;
  setTabIndex: (index: TABS) => void;
  backButtonText?: Message;
  whitelistedAddresses: Address[];
}

const requiredRoles = [ColonyRole.Root];

const ManageWhitelistDialogForm = ({
  back,
  colony,
  showInput,
  toggleShowInput,
  formSuccess,
  setFormSuccess,
  tabIndex,
  setTabIndex,
  backButtonText,
  enabledExtensionData,
  whitelistedAddresses,
}: Props) => {
  const {
    watch,
    formState: { errors, isDirty },
    reset: resetForm,
  } = useFormContext();
  const [isWhitelistActivated, whitelistAddress] = watch([
    'isWhitelistActivated',
    'whitelistAddress',
  ]);

  const {
    userHasPermission,
    disabledSubmit,
    disabledInput,
    showPermissionErrors,
  } = useActionDialogStatus(
    colony,
    requiredRoles,
    [Id.RootDomain],
    enabledExtensionData,
  );

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
          <PermissionRequiredInfo requiredRoles={requiredRoles} />
        </DialogSection>
      )}
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <Tabs
          selectedIndex={tabIndex}
          onSelect={(newIndex, lastIndex) => {
            if (newIndex === lastIndex) {
              return true;
            }
            setTabIndex(newIndex);
            resetForm();
            return false;
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
            <Annotations
              label={MSG.annotation}
              name="annotation"
              disabled={disabledInput}
            />
          </TabPanel>
          <TabPanel>
            {(whitelistedAddresses?.length && (
              <>
                <ManageWhitelistActiveToggle
                  isWhitelistActivated={isWhitelistActivated}
                />
                <WhitelistedAddresses
                  whitelistedAddresses={whitelistedAddresses}
                />
                <Annotations
                  label={MSG.annotation}
                  name="annotation"
                  disabled={disabledInput}
                />
              </>
            )) || <NoWhitelistedAddressesState />}
          </TabPanel>
        </Tabs>
      </DialogSection>
      {showPermissionErrors && (
        <DialogSection>
          <NoPermissionMessage requiredPermissions={requiredRoles} />
        </DialogSection>
      )}
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <DialogControls
          secondaryButtonText={backButtonText}
          onSecondaryButtonClick={back}
          disabled={
            /* disable the form if it isn't dirty, except for when there's an address already populated in the address field. */
            (!isDirty && !whitelistAddress) ||
            (tabIndex === TABS.WHITELISTED && !whitelistedAddresses.length) ||
            disabledSubmit
          }
          dataTest="whitelistConfirmButton"
          submitButtonAppearance={{
            theme: tabIndex === TABS.ADD_ADDRESS ? 'primary' : 'pink',
            size: 'large',
          }}
          isVotingReputationEnabled={false} // We always want this to show "Confirm" since you can't create a motion
        />
      </DialogSection>
    </>
  );
};

export default ManageWhitelistDialogForm;
