import { DomainColor } from '~gql';

export const setTeamColor = (color?: DomainColor) => {
  switch (color) {
    case DomainColor.Purple:
      return 'bg-teams-purple-400';
    case DomainColor.LightPink:
      return 'bg-teams-pink-400';
    case DomainColor.Yellow:
      return 'bg-teams-yellow-500';
    case DomainColor.Blue:
      return 'bg-indigo-400';
    case DomainColor.Green:
      return 'bg-teams-green-500';
    case DomainColor.Aqua:
      return 'bg-teams-teal-500';
    case DomainColor.Black:
      return 'bg-teams-grey-500';
    case DomainColor.BlueGrey:
      return 'bg-teams-grey-100';
    case DomainColor.EmeraldGreen:
      return 'bg-teams-green-400';
    case DomainColor.Gold:
      return 'bg-teams-yellow-100';
    case DomainColor.Magenta:
      return 'bg-teams-pink-600';
    case DomainColor.Orange:
      return 'bg-teams-red-400';
    case DomainColor.Pink:
      return 'bg-teams-pink-500';
    case DomainColor.Periwinkle:
      return 'bg-teams-indigo-500';
    case DomainColor.PurpleGrey:
      return 'bg-teams-purple-400';
    case DomainColor.Red:
      return 'bg-teams-red-600';
    default:
      return 'bg-teams-purple-400';
  }
};

export const setHexTeamColor = (color?: DomainColor) => {
  switch (color) {
    case DomainColor.Purple:
      return '--color-teams-purple-400';
    case DomainColor.LightPink:
      return '--color-teams-pink-400';
    case DomainColor.Yellow:
      return '--color-teams-yellow-500';
    case DomainColor.Blue:
      return '--color-indigo-400';
    case DomainColor.Green:
      return '--color-teams-green-500';
    case DomainColor.Aqua:
      return '--color-teams-teal-500';
    case DomainColor.Black:
      return '--color-teams-grey-500';
    case DomainColor.BlueGrey:
      return '--color-teams-grey-100';
    case DomainColor.EmeraldGreen:
      return '--color-teams-green-400';
    case DomainColor.Gold:
      return '--color-teams-yellow-100';
    case DomainColor.Magenta:
      return '--color-teams-pink-600';
    case DomainColor.Orange:
      return '--color-teams-red-400';
    case DomainColor.Pink:
      return '--color-teams-pink-500';
    case DomainColor.Periwinkle:
      return '--color-teams-indigo-500';
    case DomainColor.PurpleGrey:
      return '--color-teams-purple-400';
    case DomainColor.Red:
      return '--color-teams-red-600';
    default:
      return '--color-teams-purple-400';
  }
};

export const setTeamBadge = (color?: DomainColor) => {
  switch (color) {
    case DomainColor.Purple:
      return 'text-teams-purple-400 border-teams-purple-100';
    case DomainColor.LightPink:
      return 'text-teams-pink-400 border-teams-pink-100';
    case DomainColor.Yellow:
      return 'text-teams-yellow-500 border-teams-yellow-100';
    case DomainColor.Blue:
      return 'text-indigo-400 border-indigo-100';
    case DomainColor.Green:
      return 'text-teams-green-500 border-teams-green-100';
    case DomainColor.Aqua:
      return 'text-teams-teal-500 border-teams-teal-100';
    case DomainColor.Black:
      return 'text-gray-900 border-teams-grey-100';
    case DomainColor.BlueGrey:
      return 'text-teams-grey-500 border-teams-grey-100';
    case DomainColor.EmeraldGreen:
      return 'text-teams-green-400 border-teams-green-50';
    case DomainColor.Gold:
      return 'text-teams-red-400 border-teams-red-100';
    case DomainColor.Magenta:
      return 'text-teams-pink-600 border-teams-pink-150';
    case DomainColor.Orange:
      return 'text-teams-red-400 border-teams-yellow-50';
    case DomainColor.Pink:
      return 'text-teams-pink-500 border-teams-pink-100';
    case DomainColor.Periwinkle:
      return 'text-teams-indigo-500 border-teams-indigo-50';
    case DomainColor.PurpleGrey:
      return 'text-teams-purple-400 border-teams-purple-100';
    case DomainColor.Red:
      return 'text-teams-red-600 border-teams-red-50';
    default:
      return 'text-teams-red-600 border-teams-red-50';
  }
};
