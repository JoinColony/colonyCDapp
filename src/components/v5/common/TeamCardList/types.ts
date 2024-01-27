import { TeamCardProps } from '../TeamCard/types.ts';

export interface TeamCardListItem extends TeamCardProps {
  key: string;
}

export interface TeamCardListProps {
  items: TeamCardListItem[];
  className?: string;
}
