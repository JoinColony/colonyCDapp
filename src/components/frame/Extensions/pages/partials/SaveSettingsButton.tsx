import React, { useContext } from 'react';

import { ExtensionSaveSettingsContext } from '~context/ExtensionSaveSettingsContext/ExtensionSaveSettingsContext.ts';
import { formatText } from '~utils/intl.ts';
import ActionButton from '~v5/shared/Button/ActionButton.tsx';

const displayName = 'pages.ExtensionDetailsPage.SaveSettingsButton';

const SaveSettingsButton = () => {
  const { isVisible, actionType, handleGetValues, handleOnSuccess } =
    useContext(ExtensionSaveSettingsContext);

  return isVisible && !!actionType ? (
    <ActionButton
      useTxLoader
      actionType={actionType}
      values={handleGetValues}
      onSuccess={handleOnSuccess}
    >
      {formatText({ id: 'button.saveSettings' })}
    </ActionButton>
  ) : null;
};

SaveSettingsButton.displayName = displayName;

export default SaveSettingsButton;
