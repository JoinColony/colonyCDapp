import { ColonyRole, Id } from '@colony/colony-js';
import { BigNumber } from 'ethers';
import React, { type FC } from 'react';

import SpecificSidePanel from '~common/Extensions/SpecificSidePanel/index.ts';
import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import { ActionTypes } from '~redux';
import { type SetStakeFractionPayload } from '~redux/sagas/expenditures/setStakeFraction.ts';
import { addressHasRoles } from '~utils/checks/index.ts';
import { isInstalledExtensionData } from '~utils/extensions.ts';

import DeprecateButton from './DeprecateButton.tsx';
import { type ExtensionDetailsProps } from './types.ts';
import UninstallButton from './UninstallButton.tsx';

const displayName =
  'frame.Extensions.pages.ExtensionDetailsPage.partials.ExtensionDetails';

const ExtensionDetails: FC<ExtensionDetailsProps> = ({ extensionData }) => {
  const { user } = useAppContext();
  const { colony } = useColonyContext();

  const hasRootPermission =
    !!user &&
    addressHasRoles({
      address: user.walletAddress,
      colony,
      requiredRoles: [ColonyRole.Root],
      requiredRolesDomain: Id.RootDomain,
    });

  /* If enabled, can be deprecated */
  const canExtensionBeDeprecated =
    hasRootPermission &&
    isInstalledExtensionData(extensionData) &&
    extensionData.uninstallable &&
    extensionData.isEnabled &&
    !extensionData.isDeprecated;

  /* If installed, and deprecated / unenabled, can be uninstalled. User needs root permission to uninstall. */
  const canExtensionBeUninstalled = !!(
    hasRootPermission &&
    isInstalledExtensionData(extensionData) &&
    (extensionData.isDeprecated || !extensionData.isEnabled) &&
    extensionData.uninstallable
  );

  const setStakeFraction = useAsyncFunction({
    submit: ActionTypes.SET_STAKE_FRACTION,
    error: ActionTypes.SET_STAKE_FRACTION_ERROR,
    success: ActionTypes.SET_STAKE_FRACTION_SUCCESS,
  });

  const handleSetStakeFraction = async () => {
    const DEFAULT_STAKE_FRACTION = BigNumber.from(2)
      .mul(BigNumber.from(10).pow(DEFAULT_TOKEN_DECIMALS))
      .div(100); // 2% in wei

    const payload: SetStakeFractionPayload = {
      colonyAddress: colony.colonyAddress,
      stakeFraction: DEFAULT_STAKE_FRACTION.toString(),
    };

    await setStakeFraction(payload);
  };

  return (
    <div>
      <SpecificSidePanel extensionData={extensionData} />
      <div className="mt-6">
        {canExtensionBeDeprecated && (
          <DeprecateButton extensionData={extensionData} />
        )}
        {canExtensionBeUninstalled && (
          <UninstallButton extensionData={extensionData} />
        )}
        <button type="button" onClick={handleSetStakeFraction}>
          Do cool stuff
        </button>
      </div>
    </div>
  );
};

ExtensionDetails.displayName = displayName;

export default ExtensionDetails;
