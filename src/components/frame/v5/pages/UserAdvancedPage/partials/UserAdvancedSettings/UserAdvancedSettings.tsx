import React, { FC, useState } from 'react';
import { FormattedMessage, useIntl, defineMessages } from 'react-intl';

import Navigation from '~v5/common/Navigation';
import TwoColumns from '~v5/frame/TwoColumns';
import Spinner from '~v5/shared/Spinner';
import SettingsRow from '~v5/common/SettingsRow';
import FeesForm from '../FeesForm';
import RpcForm from '../RpcForm/RpcForm';
import Modal from '~v5/shared/Modal';
import InformationList from '~v5/shared/InformationList';
import { modalInformations } from './consts';
import Textarea from '~v5/common/Fields/Textarea';
import Checkbox from '~v5/common/Checkbox';

const displayName = 'v5.pages.UserAdvancedPage.partials.UserAdvancedSettings';

const MSG = defineMessages({
  modalDescription: {
    id: 'advancedSettings.delete.modal.description',
    defaultMessage: `Deleting your account means you could potentially lose funds and
       access to the following areas and account information on Colony.
      {br} {br} While you can delete your Colony account, you are not able to delete content on chain.
      {br} {br} Deleting your Colony account is irreversible and you will need to recreate another Colony account.`,
  },
});

const UserAdvancedSettings: FC = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { formatMessage } = useIntl();

  return (
    <Spinner loadingText={{ id: 'loading.userAdvancedPage' }}>
      <TwoColumns aside={<Navigation pageName="profile" />}>
        <FeesForm />
        <RpcForm />
        <div className="border-b border-gray-200">
          <SettingsRow
            title={{ id: 'advancedSettings.account.title' }}
            description={{ id: 'advancedSettings.account.description' }}
            // @TODO: Add functionality to download user data
            onClick={() => {}}
            buttonLabel={{ id: 'button.download' }}
            buttonIcon="file-arrow-down"
            buttonMode="primaryOutline"
          />
        </div>
        <SettingsRow
          title={{ id: 'advancedSettings.delete.title' }}
          description={{ id: 'advancedSettings.delete.description' }}
          onClick={() => setIsDeleteModalOpen(true)}
          buttonLabel={{ id: 'button.deleteAccount' }}
          buttonIcon="trash"
          buttonMode="secondaryOutline"
        />
        <Modal
          // @TODO: Add functionality onConfirm to delete account
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsChecked(false);
            setIsDeleteModalOpen(false);
          }}
          isWarning
          icon="trash"
          disabled={!isChecked}
          confirmMessage={formatMessage({
            id: 'button.deleteAccountConfirmation',
          })}
          closeMessage={formatMessage({ id: 'button.deleteAccountCancel' })}
        >
          <h5 className="heading-5 mb-1.5">
            {formatMessage({ id: 'advancedSettings.delete.modal.title' })}
          </h5>
          <p className="text-md text-gray-600 mb-6">
            <FormattedMessage
              {...MSG.modalDescription}
              values={{
                br: <br />,
              }}
            />
          </p>
          <InformationList items={modalInformations} className="mb-4" />
          <div className="mb-4">
            <Textarea
              textareaTitle={{
                id: 'advancedSettings.delete.modal.textarea.label',
              }}
            />
          </div>
          <Checkbox
            id="delete-account"
            name="delete-account"
            onChange={() => {
              setIsChecked(!isChecked);
            }}
          >
            {formatMessage({
              id: 'advancedSettings.delete.modal.checkbox.label',
            })}
          </Checkbox>
        </Modal>
      </TwoColumns>
    </Spinner>
  );
};

UserAdvancedSettings.displayName = displayName;

export default UserAdvancedSettings;
