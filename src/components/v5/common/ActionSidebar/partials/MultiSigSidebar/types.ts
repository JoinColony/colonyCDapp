import { type ICompletedAction } from '~v5/common/CompletedAction/types.ts';

export interface ICompletedMultiSigAction extends ICompletedAction {
  multiSigData: NonNullable<ICompletedAction['action']['multiSigData']>;
}
