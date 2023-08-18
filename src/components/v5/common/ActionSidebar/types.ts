import { Actions } from '~constants/actions';

export type PopularActionsProps = {
  setSelectedAction: React.Dispatch<React.SetStateAction<Actions | null>>;
};
