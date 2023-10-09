import { PollingControls } from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/MotionPhaseWidget';
import { ColonyMotion } from '~types';

export interface RevealStepProps
  extends Omit<PollingControls, 'refetchAction'> {
  motionData: ColonyMotion;
  transactionId: string;
}
