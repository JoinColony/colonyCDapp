import { ColonyRole, Id } from '@colony/colony-js';
import { useFormContext } from 'react-hook-form';

import { useActionDialogStatus, EnabledExtensionData } from '~hooks';
import { SelectOption } from '~shared/Fields';
import { Colony, Domain } from '~types';
import { findDomainByNativeId } from '~utils/domains';

export const getEditDomainDialogPayload = (
  colony: Colony,
  { domainId, ...rest },
) => ({
  ...rest,
  domain: findDomainByNativeId(domainId, colony),
  colonyAddress: colony.colonyAddress,
  colonyName: colony.name,
  isCreateDomain: false,
  customActionTitle: '',
});

export const useEditDomainDialogStatus = (
  colony: Colony,
  requiredRoles: ColonyRole[],
  enabledExtensionData: EnabledExtensionData,
  domainOptions: SelectOption[],
) => {
  const {
    watch,
    formState: { dirtyFields },
  } = useFormContext();
  const { domainId, motionDomainId } = watch();
  const {
    disabledSubmit: defaultDisabledSubmit,
    disabledInput: defaultDisabledInput,
    ...rest
  } = useActionDialogStatus(
    colony,
    requiredRoles,
    [domainId],
    enabledExtensionData,
    motionDomainId,
  );

  const hasEditedDomain =
    dirtyFields.domainColor ||
    dirtyFields.domainName ||
    dirtyFields.domainPurpose;
  const disabledSubmit = defaultDisabledSubmit || !hasEditedDomain;
  const disabledInput = defaultDisabledInput || domainOptions.length === 0;

  return {
    ...rest,
    disabledInput,
    disabledSubmit,
  };
};

export const notRootDomain = (domain: Domain) =>
  domain.nativeId !== Id.RootDomain;
