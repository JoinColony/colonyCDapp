import { type SetStateFn } from '~types';
import { type AnyExtensionData } from '~types/extensions.ts';
import { type ExtensionStatusBadgeMode } from '~v5/common/Pills/types.ts';

export interface ActionButtonProps {
  extensionData: AnyExtensionData;
  isSetupRoute: boolean;
  waitingForActionConfirmation: boolean;
  setIsEnabling: SetStateFn<boolean>;
  setWaitingForActionConfirmation: SetStateFn<boolean>;
  extensionStatusMode?: ExtensionStatusBadgeMode;
  extensionStatusText?: React.ReactNode;
}
