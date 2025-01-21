import { type CompletedActionProps } from '~v5/common/CompletedAction/types.ts';

export interface RevealStepProps extends Pick<CompletedActionProps, 'action'> {
  motionState?: number;
}
