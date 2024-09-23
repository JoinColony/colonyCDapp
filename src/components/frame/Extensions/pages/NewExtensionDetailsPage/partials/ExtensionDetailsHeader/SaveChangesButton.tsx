import React, { type FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { useExtensionDetailsPageContext } from '~frame/Extensions/pages/NewExtensionDetailsPage/context/ExtensionDetailsPageContext.ts';
import { useMobile } from '~hooks/index.ts';
import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/Button.tsx';

const displayName = 'pages.ExtensionDetailsPage.SaveChangesButton';

const SaveChangesButton: FC = () => {
  const isMobile = useMobile();
  const {
    formState: { isSubmitting, isDirty },
  } = useFormContext();
  const { waitingForActionConfirmation } = useExtensionDetailsPageContext();

  if (!isDirty) {
    return null;
  }

  return (
    <Button
      type="submit"
      isFullSize={isMobile}
      loading={isSubmitting || waitingForActionConfirmation}
    >
      {formatText({ id: 'button.saveChanges' })}
    </Button>
  );
};

SaveChangesButton.displayName = displayName;

export default SaveChangesButton;
