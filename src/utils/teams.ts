import { DomainColor } from '~gql';

export const getTeamColor = (color?: DomainColor) => {
  switch (color) {
    case DomainColor.Aqua:
      return 'bg-teams-yellow-500';
    case DomainColor.Black:
      return 'bg-teams-red-400';
    case DomainColor.Blue:
      return 'bg-teams-red-600';
    case DomainColor.BlueGrey:
      return 'bg-teams-pink-400';
    case DomainColor.EmeraldGreen:
      return 'bg-teams-pink-500';
    case DomainColor.Gold:
      return 'bg-teams-pink-600';
    case DomainColor.Green:
      return 'bg-teams-purple-400';
    case DomainColor.LightPink:
      return 'bg-teams-purple-500';
    case DomainColor.Magenta:
      return 'bg-teams-green-300';
    case DomainColor.Orange:
      return 'bg-teams-green-400';
    case DomainColor.Periwinkle:
      return 'bg-teams-green-500';
    case DomainColor.Pink:
      return 'bg-teams-teal-500';
    case DomainColor.Purple:
      return 'bg-teams-blue-500';
    case DomainColor.PurpleGrey:
      return 'bg-teams-blue-400';
    case DomainColor.Red:
      return 'bg-teams-indigo-500';
    case DomainColor.Yellow:
      return 'bg-teams-grey-500';
    default:
      return 'bg-blue-400';
  }
};

export const getTeamHexColor = (color?: DomainColor) => {
  switch (color) {
    case DomainColor.Aqua:
      return '--color-teams-yellow-500';
    case DomainColor.Black:
      return '--color-teams-red-400';
    case DomainColor.Blue:
      return '--color-teams-red-600';
    case DomainColor.BlueGrey:
      return '--color-teams-pink-400';
    case DomainColor.EmeraldGreen:
      return '--color-teams-pink-500';
    case DomainColor.Gold:
      return '--color-teams-pink-600';
    case DomainColor.Green:
      return '--color-teams-purple-400';
    case DomainColor.LightPink:
      return '--color-teams-purple-500';
    case DomainColor.Magenta:
      return '--color-teams-green-300';
    case DomainColor.Orange:
      return '--color-teams-green-400';
    case DomainColor.Periwinkle:
      return '--color-teams-green-500';
    case DomainColor.Pink:
      return '--color-teams-teal-500';
    case DomainColor.Purple:
      return '--color-teams-blue-500';
    case DomainColor.PurpleGrey:
      return '--color-teams-blue-400';
    case DomainColor.Red:
      return '--color-teams-indigo-500';
    case DomainColor.Yellow:
      return '--color-teams-grey-500';
    default:
      return '--color-blue-400';
  }
};

export const getTeamHexSecondaryColor = (color?: DomainColor) => {
  switch (color) {
    case DomainColor.Aqua:
      return '--color-teams-yellow-200';
    case DomainColor.Black:
      return '--color-teams-red-200';
    case DomainColor.Blue:
      return '--color-teams-red-50';
    case DomainColor.BlueGrey:
      return '--color-teams-pink-50';
    case DomainColor.EmeraldGreen:
      return '--color-teams-pink-50';
    case DomainColor.Gold:
      return '--color-teams-red-50';
    case DomainColor.Green:
      return '--color-teams-purple-100';
    case DomainColor.LightPink:
      return '--color-teams-purple-100';
    case DomainColor.Magenta:
      return '--color-teams-green-100';
    case DomainColor.Orange:
      return '--color-success-200';
    case DomainColor.Periwinkle:
      return '--color-teams-green-100';
    case DomainColor.Pink:
      return '--color-teams-teal-50';
    case DomainColor.Purple:
      return '--color-teams-blue-50';
    case DomainColor.PurpleGrey:
      return '--color-teams-blue-50';
    case DomainColor.Red:
      return '--color-teams-indigo-50';
    case DomainColor.Yellow:
      return '--color-teams-grey-100';
    default:
      return '--color-teams-blue-50';
  }
};

export const getTeamBadgeStyles = (color?: DomainColor) => {
  switch (color) {
    case DomainColor.Aqua:
      return 'text-teams-yellow-500 border-teams-yellow-100';
    case DomainColor.Black:
      return 'text-teams-red-400 border-teams-red-100';
    case DomainColor.Blue:
      return 'text-teams-red-600 border-teams-red-50';
    case DomainColor.BlueGrey:
      return 'text-teams-pink-400 border-teams-pink-100';
    case DomainColor.EmeraldGreen:
      return 'text-teams-pink-500 border-teams-pink-100';
    case DomainColor.Gold:
      return 'text-teams-pink-600 border-teams-pink-150';
    case DomainColor.Green:
      return 'text-teams-purple-400 border-teams-purple-100';
    case DomainColor.LightPink:
      return 'text-teams-purple-500 border-teams-purple-100';
    case DomainColor.Magenta:
      return 'text-teams-green-300 border-teams-green-100';
    case DomainColor.Orange:
      return 'text-teams-green-400 border-teams-green-50';
    case DomainColor.Periwinkle:
      return 'text-teams-green-500 border-teams-green-100';
    case DomainColor.Pink:
      return 'text-teams-teal-500 border-teams-teal-50';
    case DomainColor.Purple:
      return 'text-teams-blue-500 border-teams-blue-50';
    case DomainColor.PurpleGrey:
      return 'text-teams-blue-400 border-teams-blue-50';
    case DomainColor.Red:
      return 'text-teams-indigo-500 border-teams-indigo-50';
    case DomainColor.Yellow:
      return 'text-teams-grey-500 border-teams-grey-100';
    default:
      return 'text-blue-400 border-blue-100';
  }
};
