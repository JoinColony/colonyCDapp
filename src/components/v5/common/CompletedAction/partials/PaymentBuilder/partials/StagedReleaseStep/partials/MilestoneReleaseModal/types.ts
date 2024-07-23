import { type Expenditure } from '~types/graphql.ts';
import { type ModalProps } from '~v5/shared/Modal/types.ts';

import { type MilestoneItemProps } from '../MilestoneItem/types.ts';

export interface MilestoneItem extends MilestoneItemProps {
  id: number;
  isReleased: boolean;
}

export interface MilestoneReleaseModalProps extends ModalProps {
  items: MilestoneItem[];
  hasAllMilestonesReleased: boolean;
  expenditure: Expenditure;
}

export type MilestoneModalContentProps = Pick<
  MilestoneReleaseModalProps,
  'onClose' | 'items' | 'hasAllMilestonesReleased'
>;
