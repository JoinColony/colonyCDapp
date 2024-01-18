import { TeamCardProps } from '../TeamCard/types';

export interface TeamCardListItem extends TeamCardProps {
  key: string;
}

export interface TeamCardListProps {
  items: TeamCardListItem[];
  className?: string;
}
