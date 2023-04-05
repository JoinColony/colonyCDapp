import { DomainColor } from '~gql';

export const setTeamColor = (color?: DomainColor) => {
  switch (color) {
    case DomainColor.Purple:
      return 'bg-teams-purple-400';
    case DomainColor.LightPink:
      return 'bg-teams-red-600';
    case DomainColor.Yellow:
      return 'bg-teams-yellow-500';
    case DomainColor.Blue:
      return 'bg-teams-blue-400';
    case DomainColor.Green:
      return 'bg-teams-green-500';
    case DomainColor.Aqua:
      return 'bg-teams-teal-500';
    case DomainColor.Black:
      return 'bg-teams-gray-500';
    case DomainColor.BlueGrey:
      return 'bg-teams-grey-100';
    case DomainColor.EmeraldGreen:
      return 'bg-teams-green-400';
    case DomainColor.Gold:
      return 'bg-teams-yellow-100';
    case DomainColor.Magenta:
      return 'bg-teams-purple-500';
    case DomainColor.Orange:
      return 'bg-teams-yellow-500';
    case DomainColor.Pink:
      return 'bg-teams-pink-500';
    case DomainColor.Periwinkle:
      return 'bg-teams-pink-600';
    case DomainColor.PurpleGrey:
      return 'bg-teams-purple-400';
    case DomainColor.Red:
      return 'bg-teams-red-600';
    default:
      return 'bg-teams-purple-400';
  }
};
