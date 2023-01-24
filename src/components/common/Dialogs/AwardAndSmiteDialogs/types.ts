import { WizardDialogType } from '~hooks';
import { DialogProps, ActionDialogProps } from '~shared/Dialog';
import { User } from '~types/index';

export interface ManageReputationDialogFormValues {
  forceAction: boolean;
  domainId: string;
  user: User | null;
  amount: number | null;
  annotation: string;
  motionDomainId: number;
}

export type AwardAndSmiteDialogProps = Required<DialogProps> &
  WizardDialogType<object> &
  ActionDialogProps & {
    isSmiteAction: boolean;
    ethDomainId?: number;
  };
