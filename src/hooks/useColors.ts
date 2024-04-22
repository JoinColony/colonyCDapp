import { DomainColor } from '~gql';

const useColors = () => {
  const colors = Object.values(DomainColor)
    .filter((color) => color !== DomainColor.Root)
    .map((color) => {
      return {
        label: color,
        value: color,
        color,
        isDisabled: false,
      };
    });

  return {
    options: colors || [],
    key: 'colors',
    title: { id: 'actions.colors' },
    isAccordion: false,
  };
};

export default useColors;
