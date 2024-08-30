import { type ColonyAction, type Expenditure } from '~types/graphql.ts';
import { type StreamingPaymentStatus } from '~types/streamingPayments.ts';
import { type MotionState } from '~utils/colonyMotions.ts';

export interface ActionSidebarStatusPillProps {
  action: ColonyAction | null | undefined;
  motionState: MotionState | undefined;
  expenditure: Expenditure | null | undefined;
  streamingPaymentStatus: StreamingPaymentStatus | undefined;
  isMotion: boolean;
  isMultiSig: boolean;
}
