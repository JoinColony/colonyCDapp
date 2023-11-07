import React, { useMemo } from 'react';

import { useFormContext, useWatch } from 'react-hook-form';
import { useApolloClient } from '@apollo/client';
import { ACTION, Action } from '~constants/actions';
import { useAppContext, useColonyContext } from '~hooks';
import { ACTION_TYPE_FIELD_NAME } from '../consts';
import { DescriptionMetadataGetter } from '../types';
import AsyncText from '~v5/shared/AsyncText';
import { simplePaymentDescriptionMetadataGetter } from '../partials/forms/SimplePaymentForm/utils';
import { advancedPaymentDescriptionMetadataGetter } from '../partials/forms/AdvancedPaymentForm/utils';
import { splitPaymentDescriptionMetadataGetter } from '../partials/forms/SplitPaymentForm/utils';
import { trasferFundsDescriptionMetadataGetter } from '../partials/forms/TransferFundsForm/utils';
import { mintTokenDescriptionMetadataGetter } from '../partials/forms/MintTokenForm/utils';
import { unlockTokenDescriptionMetadataGetter } from '../partials/forms/UnlockTokenForm/utils';
import { manageTokensDescriptionMetadataGetter } from '../partials/forms/ManageTokensForm/utils';
import { editColonyDetailsDescriptionMetadataGetter } from '../partials/forms/EditColonyDetailsForm/utils';
import { createNewTeamDescriptionMetadataGetter } from '../partials/forms/CreateNewTeamForm/utils';
import { editTeamDescriptionMetadataGetter } from '../partials/forms/EditTeamForm/utils';
import { upgradeColonyDescriptionMetadataGetter } from '../partials/forms/UpgradeColonyForm/utils';
import { enterRecoveryModeDescriptionMetadataGetter } from '../partials/forms/EnterRecoveryModeForm/utils';
import { createDecisionDescriptionMetadataGetter } from '../partials/forms/CreateDecisionForm/utils';
import { managePermissionsDescriptionMetadataGetter } from '../partials/forms/ManagePermissionsForm/utils';
import { manageColonyObjectivesDescriptionMetadataGetter } from '../partials/forms/ManageColonyObjectivesForm/utils';

const DESC_METADATA: Partial<Record<Action, DescriptionMetadataGetter>> = {
  [ACTION.SIMPLE_PAYMENT]: simplePaymentDescriptionMetadataGetter,
  [ACTION.ADVANCED_PAYMENT]: advancedPaymentDescriptionMetadataGetter,
  [ACTION.SPLIT_PAYMENT]: splitPaymentDescriptionMetadataGetter,
  [ACTION.TRANSFER_FUNDS]: trasferFundsDescriptionMetadataGetter,
  [ACTION.MINT_TOKENS]: mintTokenDescriptionMetadataGetter,
  [ACTION.UNLOCK_TOKEN]: unlockTokenDescriptionMetadataGetter,
  [ACTION.MANAGE_TOKENS]: manageTokensDescriptionMetadataGetter,
  [ACTION.EDIT_COLONY_DETAILS]: editColonyDetailsDescriptionMetadataGetter,
  [ACTION.CREATE_NEW_TEAM]: createNewTeamDescriptionMetadataGetter,
  [ACTION.EDIT_EXISTING_TEAM]: editTeamDescriptionMetadataGetter,
  [ACTION.UPGRADE_COLONY_VERSION]: upgradeColonyDescriptionMetadataGetter,
  [ACTION.ENTER_RECOVERY_MODE]: enterRecoveryModeDescriptionMetadataGetter,
  [ACTION.CREATE_DECISION]: createDecisionDescriptionMetadataGetter,
  [ACTION.MANAGE_PERMISSIONS]: managePermissionsDescriptionMetadataGetter,
  [ACTION.MANAGE_COLONY_OBJECTIVES]:
    manageColonyObjectivesDescriptionMetadataGetter,
};

export const useActionDescriptionMetadata = () => {
  const formValues = useFormContext().getValues();
  const selectedAction: Action | undefined = useWatch({
    name: ACTION_TYPE_FIELD_NAME,
  });
  const apolloClient = useApolloClient();
  const { user } = useAppContext();
  const { colony } = useColonyContext();

  return useMemo(() => {
    if (!selectedAction) {
      return undefined;
    }

    return (
      <AsyncText
        text={async () =>
          DESC_METADATA[selectedAction]?.(formValues, {
            client: apolloClient,
            currentUser: user,
            colony,
          })
        }
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(formValues), selectedAction, apolloClient, colony]);
};
