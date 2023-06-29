import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useColonyContext } from '~hooks';
import Button from '~shared/Button/Button';
import { InstalledExtensionData } from '~types';

interface Props {
  extensionData: InstalledExtensionData;
  inputDisabled: boolean;
  stopPolling: () => void;
}

const EnableButton = ({ extensionData, inputDisabled, stopPolling }: Props) => {
  const { colony } = useColonyContext();
  const navigate = useNavigate();
  stopPolling();

  if (!colony) {
    return null;
  }

  const handleEnableButtonClick = () => {
    navigate(
      `/colony/${colony.name}/extensions/${extensionData.extensionId}/setup`,
    );
  };

  return (
    <Button
      appearance={{ theme: 'primary', size: 'medium' }}
      onClick={handleEnableButtonClick}
      text={{ id: 'button.enable' }}
      disabled={inputDisabled}
    />
  );
};

export default EnableButton;
