import { Extension } from '@colony/colony-js';
import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'react-toastify';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useMobile } from '~hooks/index.ts';
import { ActionTypes } from '~redux/index.ts';
import Toast from '~shared/Extensions/Toast/Toast.tsx';
import { type AnyExtensionData } from '~types/extensions.ts';
import { formatText } from '~utils/intl.ts';
import ActionButton from '~v5/shared/Button/ActionButton.tsx';

interface InstallButtonProps {
  extensionData: AnyExtensionData;
}

const displayName = 'pages.ExtensionPage.InstallButton';

const InstallButton = ({ extensionData }: InstallButtonProps) => {
  const {
    colony: { colonyAddress },
    isSupportedColonyVersion,
  } = useColonyContext();

  const isMobile = useMobile();

  const { extensionId } = extensionData;

  const {
    watch,
    formState: { isValid },
  } = useFormContext();

  const { params } = watch();

  const handleInstallSuccess = async () => {
    toast.success(
      <Toast
        type="success"
        title={{ id: 'extensionInstall.toast.title.success' }}
        description={{
          id: 'extensionInstall.toast.description.success',
        }}
      />,
    );
  };

  const handleInstallError = () => {
    toast.error(
      <Toast
        type="error"
        title={{ id: 'extensionInstall.toast.title.error' }}
        description={{ id: 'extensionInstall.toast.description.error' }}
      />,
    );
  };

  const action: {
    type: ActionTypes | null;
    values: Record<string, any> | null;
  } = useMemo(() => {
    if (extensionId === Extension.StakedExpenditure) {
      return {
        type: ActionTypes.SET_STAKE_FRACTION,
        values: {
          colonyAddress,
          stakeFraction: params.stakeFraction,
        },
      };
    }

    return { type: null, values: null };
  }, [colonyAddress, extensionId, params.stakeFraction]);

  if (!action.type) return null;

  const isDisabled = !isValid || !isSupportedColonyVersion || !action.type;

  return (
    <ActionButton
      actionType={action.type}
      values={{ ...action.values }}
      onSuccess={handleInstallSuccess}
      onError={handleInstallError}
      isFullSize={isMobile}
      disabled={isDisabled}
    >
      {formatText({ id: 'button.saveSettings' })}
    </ActionButton>
  );
};

InstallButton.displayName = displayName;

export default InstallButton;
