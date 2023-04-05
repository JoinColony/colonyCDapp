import { ColonyRole, Id } from '@colony/colony-js';
import { useFormContext } from 'react-hook-form';

import { useActionDialogStatus, EnabledExtensionData } from '~hooks';
import { Colony, Domain } from '~types';
import { findDomainByNativeId } from '~utils/domains';

export const getEditDomainDialogPayload = (colony: Colony, { domainId, ...rest }) => ({
  ...rest,
  domain: findDomainByNativeId(domainId, colony),
  colonyAddress: colony.colonyAddress,
  colonyName: colony.name,
  isCreateDomain: false,
});

export const useEditDomainDialogStatus = (
  colony: Colony,
  requiredRoles: ColonyRole[],
  enabledExtensionData: EnabledExtensionData,
) => {
  const {
    watch,
    formState: { dirtyFields },
  } = useFormContext();
  const domainId = watch('domainId');
  const {
    userHasPermission,
    disabledSubmit: defaultDisabledSubmit,
    disabledInput,
    canCreateMotion,
  } = useActionDialogStatus(colony, requiredRoles, [domainId], enabledExtensionData, domainId);

  const hasEditedDomain = dirtyFields.domainColor || dirtyFields.domainName || dirtyFields.domainPurpose;
  const disabledSubmit = defaultDisabledSubmit || !hasEditedDomain;

  return {
    userHasPermission,
    disabledInput,
    disabledSubmit,
    canCreateMotion,
  };
};

export const notRootDomain = (domain: Domain) => domain.nativeId !== Id.RootDomain;
