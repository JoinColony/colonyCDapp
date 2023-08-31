import { DomainColor } from '~gql';

export type SelectedTeamColourPillProps = {
  title: string;
  defaultColor?: DomainColor;
};

export type TeamColourBadgeProps = SelectedTeamColourPillProps;

export type TeamColourFieldProps = {
  isError?: boolean;
};
