import { type ManagePermissionsFormValues } from '~v5/common/ActionSidebar/partials/forms/ManagePermissionsForm/consts.ts';

export interface PermissionsRemovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  isFormSubmitting: boolean;
  formRole: ManagePermissionsFormValues['role'];
  formPermissions: ManagePermissionsFormValues['permissions'];
  dbRoleForDomain: ManagePermissionsFormValues['_dbRoleForDomain'];
  dbInheritedPermissions: ManagePermissionsFormValues['_dbInheritedPermissions'];
}
