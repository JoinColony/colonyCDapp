import { type Expenditure } from '~types/graphql.ts';
import { type ModalProps } from '~v5/shared/Modal/types.ts';

import { type MilestoneItemProps } from '../MilestoneItem/types.ts';

export interface MilestoneItem extends MilestoneItemProps {
  slotId: number;
  isClaimed: boolean;
}

export interface MilestoneReleaseModalProps extends ModalProps {
  items: MilestoneItem[];
  hasAllMilestonesReleased: boolean;
  expenditure: Expenditure;
  slotsWithActiveMotions: number[];
}

export type MilestoneModalContentProps = Pick<
  MilestoneReleaseModalProps,
  | 'onClose'
  | 'items'
  | 'hasAllMilestonesReleased'
  | 'slotsWithActiveMotions'
  | 'expenditure'
>;
