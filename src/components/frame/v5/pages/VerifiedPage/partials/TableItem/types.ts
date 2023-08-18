import { ColonyContributor } from '~types';

export interface TableItemProps {
  member: ColonyContributor;
  onDeleteClick: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
