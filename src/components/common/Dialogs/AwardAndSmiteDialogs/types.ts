import { WizardDialogType } from '~hooks';
import { DialogProps, ActionDialogProps } from '~shared/Dialog';

export type AwardAndSmiteDialogProps = Required<DialogProps> &
  WizardDialogType<object> &
  ActionDialogProps & {
    isSmiteAction: boolean;
    filteredDomainId?: number;
  };
