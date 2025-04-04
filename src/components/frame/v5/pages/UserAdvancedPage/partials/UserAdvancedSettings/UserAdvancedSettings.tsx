// @BETA: Disabled for now
// import Checkbox from '~v5/common/Checkbox';
// import Textarea from '~v5/common/Fields/Textarea';
// import SettingsRow from '~v5/common/SettingsRow';
// import InformationList from '~v5/shared/InformationList';
// import Modal from '~v5/shared/Modal';

import React, { type FC } from 'react';
import { useIntl } from 'react-intl';

import MetaTransactionsSection from '../MetatransactionsSection/MetaTransactionsSection.tsx';
import NotificationsSection from '../NotificationsSection/NotificationsSection.tsx';
// @BETA: Disabled for now
// import RpcForm from '../RpcForm/RpcForm';
// import { modalInformations } from './consts';

const displayName = 'v5.pages.UserAdvancedPage.partials.UserAdvancedSettings';

const UserAdvancedSettings: FC = () => {
  // @BETA: Disabled for now
  // const [isChecked, setIsChecked] = useState(false);
  // const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { formatMessage } = useIntl();

  return (
    <div className="flex flex-col gap-6">
      <h4 className="heading-4">
        {formatMessage({ id: 'advancedSettings.title' })}
      </h4>
      <MetaTransactionsSection />
      <NotificationsSection />
      {/* @BETA: Disabled for noew */}
      {/* <span className="divider" /> */}
      {/* <RpcForm /> */}
      {/* <span className="divider" /> */}
      {/* <SettingsRow */}
      {/*   title={{ id: 'advancedSettings.account.title' }} */}
      {/*   description={{ id: 'advancedSettings.account.description' }} */}
      {/*   // @TODO: Add functionality to download user data */}
      {/*   onClick={() => {}} */}
      {/*   buttonLabel={{ id: 'button.download' }} */}
      {/*   buttonIcon="file-arrow-down" */}
      {/*   buttonMode="primaryOutline" */}
      {/* /> */}
      {/* <span className="divider" /> */}
      {/* <SettingsRow */}
      {/*   title={{ id: 'advancedSettings.delete.title' }} */}
      {/*   description={{ id: 'advancedSettings.delete.description' }} */}
      {/*   onClick={() => setIsDeleteModalOpen(true)} */}
      {/*   buttonLabel={{ id: 'button.deleteAccount' }} */}
      {/*   buttonIcon="trash" */}
      {/*   buttonMode="secondaryOutline" */}
      {/* /> */}
      {/* <Modal */}
      {/*   // @TODO: Add functionality onConfirm to delete account */}
      {/*   isOpen={isDeleteModalOpen} */}
      {/*   onClose={() => { */}
      {/*     setIsChecked(false); */}
      {/*     setIsDeleteModalOpen(false); */}
      {/*   }} */}
      {/*   isWarning */}
      {/*   icon="trash" */}
      {/*   disabled={!isChecked} */}
      {/*   confirmMessage={formatMessage({ */}
      {/*     id: 'button.deleteAccountConfirmation', */}
      {/*   })} */}
      {/*   closeMessage={formatMessage({ id: 'button.deleteAccountCancel' })} */}
      {/* > */}
      {/*   <h5 className="heading-5 mb-1.5"> */}
      {/*     {formatMessage({ id: 'advancedSettings.delete.modal.title' })} */}
      {/*   </h5> */}
      {/*   <p className="text-md text-gray-600 mb-6"> */}
      {/*     {formatMessage( */}
      {/*       { id: 'advancedSettings.delete.modal.description' }, */}
      {/*       { br: <br /> }, */}
      {/*     )} */}
      {/*   </p> */}
      {/*   <InformationList items={modalInformations} className="mb-4" /> */}
      {/*   <div className="mb-4"> */}
      {/*     <Textarea */}
      {/*       textareaTitle={{ */}
      {/*         id: 'advancedSettings.delete.modal.textarea.label', */}
      {/*       }} */}
      {/*     /> */}
      {/*   </div> */}
      {/*   <Checkbox */}
      {/*     id="delete-account" */}
      {/*     name="delete-account" */}
      {/*     isChecked={isChecked} */}
      {/*     onChange={() => { */}
      {/*       setIsChecked(!isChecked); */}
      {/*     }} */}
      {/*   > */}
      {/*     {formatMessage({ */}
      {/*       id: 'advancedSettings.delete.modal.checkbox.label', */}
      {/*     })} */}
      {/*   </Checkbox> */}
      {/* </Modal> */}
    </div>
  );
};

UserAdvancedSettings.displayName = displayName;

export default UserAdvancedSettings;
