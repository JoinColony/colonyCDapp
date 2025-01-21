import { type IActionContext } from '~context/ActionContext/ActionContext.ts';

export interface CompletedActionProps {
  action: NonNullable<IActionContext['action']>;
}
