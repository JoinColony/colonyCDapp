import { type ManagePermissionsFormValues } from '../../consts.ts';

export interface PermissionsRemovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  isFormSubmitting: boolean;
  formRole: ManagePermissionsFormValues['role'];
  formPermissions: ManagePermissionsFormValues['permissions'];
  dbRoleForDomain: ManagePermissionsFormValues['_dbRoleForDomain'];
  dbInheritedPermissions: ManagePermissionsFormValues['_dbInheritedPermissions'];
}
