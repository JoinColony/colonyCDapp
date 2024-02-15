import { type DomainColor } from '~gql';

export interface SelectedTeamColourPillProps {
  title: string;
  defaultColor?: DomainColor;
}

export type TeamColourBadgeProps = SelectedTeamColourPillProps;

export interface TeamColourFieldProps {
  name: string;
  disabled?: boolean;
}
