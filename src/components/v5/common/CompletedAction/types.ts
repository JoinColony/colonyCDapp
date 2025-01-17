import { type IActionContext } from '~context/ActionContext/ActionContext.ts';

export interface ICompletedAction {
  action: NonNullable<IActionContext['action']>;
}
