import React, { FC, useRef } from 'react';
import { useOnClickOutside } from 'usehooks-ts';

import { useMobile } from '~hooks';
import Button from '~v5/shared/Button';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import { ActionButtonsProps } from '../types';

const displayName = 'v5.common.ActionSidebar.partials.ActionButtons';

const ActionButtons: FC<ActionButtonsProps> = ({ isActionDisabled }) => {
  const ref = useRef(null);
  const isMobile = useMobile();
  const { toggleActionSidebarOff, selectedAction } = useActionSidebarContext();

  useOnClickOutside(ref, () => !isMobile && toggleActionSidebarOff());

  return (
    <div
      className="flex items-center flex-col-reverse sm:flex-row 
        justify-end gap-2 p-6 border-t border-gray-200"
    >
      <Button
        mode="primaryOutline"
        text={{ id: 'button.cancel' }}
        onClick={toggleActionSidebarOff}
        isFullSize={isMobile}
      />
      <Button
        mode="primarySolid"
        disabled={
          !selectedAction || isActionDisabled
          // || !!Object.keys(methods.formState.errors).length
        }
        text={{ id: 'button.createAction' }}
        isFullSize={isMobile}
        type="submit"
        // loading={methods?.formState?.isSubmitting}
      />
    </div>
  );
};

ActionButtons.displayName = displayName;

export default ActionButtons;
